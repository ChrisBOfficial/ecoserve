const cors = require("cors");
const express = require("express");
const history = require("connect-history-api-fallback");
const request = require("request");
const path = require("path");
const unzip = require("unzip-stream");
const util = require("util");
// const fs = require('fs');
const requestPromise = util.promisify(request);
const app = express();

require("dotenv").config(); // Loads .env file

// Use AWS port if provided, 3000 otherwise
let port = process.env.PORT || 3000;
let distDirectory;
let Pipelines;
if (port === 3000 || process.env.NODE_ENV === "development") {
    distDirectory = "../dist";
    Pipelines = require("./api/pipelines.js");
} else {
    console.log("IN PRODUCTION");
    distDirectory = "dist";
    Pipelines = require("./pipelines.js");
    app.use(history()); // Middleware for HTML5 history mode
}

// Initialize MongoDB connection using Admin user if provided, TestUser otherwise
const MongoClient = require("mongodb").MongoClient;
const uri =
    process.env.MONGO_URI ||
    "mongodb+srv://TestUser:mochatest@invasive-species-toriy.mongodb.net/test?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
dbClient.connect(err => {
    if (err) throw new Error(err);
    console.log("MongoDB connected");
});

// Add express configurations
app.use(cors()); // Allow interaction with Vue serve and Qualtrics Web Listeners
app.use(express.urlencoded({ extended: true })); // Middleware for handling raw POST data
app.use(express.json()); // Support JSON payloads in POST requests
app.use(express.static(path.join(__dirname, distDirectory))); // Serve files in dist folder for all HTTP requests

// Start server and socket.io instance on the port
const server = app.listen(port, () => {
    console.log("Server started on port " + port);
});
const io = require("socket.io")(server);

// Any routes will be redirected to the vue app, using index.html as homepage
app.get("/", (_, res) => {
    res.sendFile(path.join(__dirname, distDirectory, "/index.html"));
});

//* Endpoint for survey information
app.route("/api/surveys").get((req, res) => {
    let specifier;
    if (req.query.surveyId === undefined) {
        specifier = "";
    } else {
        specifier = req.query.surveyId;
    }
    let targetUrl = "https://" + process.env.VUE_APP_Q_DATA_CENTER + ".qualtrics.com/API/v3/surveys/" + specifier;
    let options = {
        method: "GET",
        url: targetUrl,
        headers: {
            "X-API-TOKEN": req.headers["x-api-token"]
        }
    };
    request(options, function(error, response, body) {
        if (error) throw new Error(error);
        if (response.statusCode !== 200) {
            res.status(response.statusCode).send(response);
        } else {
            res.send(body);
        }
    });
});

//* Endpoint for survey response data
app.route("/api/surveys/responses")
    .get((req, res) => {
        async function respond(req, res) {
            // Create data export
            const surveyId = req.query.surveyId;
            let progressStatus = "inProgress";
            let baseUrl =
                "https://" +
                process.env.VUE_APP_Q_DATA_CENTER +
                ".qualtrics.com/API/v3/surveys/" +
                surveyId +
                "/export-responses/";
            let options = {
                method: "POST",
                url: baseUrl,
                json: { format: "json" },
                headers: {
                    "content-type": "application/json",
                    "X-API-TOKEN": req.headers["x-api-token"]
                }
            };
            let downloadRequestResponse = await requestPromise(options);
            let progressId = downloadRequestResponse.body.result.progressId;

            // Checking on data export progress and waiting until ready
            let parsedResponse;
            while (progressStatus !== "complete" && progressStatus !== "failed") {
                let requestCheckUrl = baseUrl + progressId;
                delete options.json;
                options = {
                    method: "GET",
                    url: requestCheckUrl,
                    headers: {
                        "content-type": "application/json",
                        "X-API-TOKEN": req.headers["x-api-token"]
                    }
                };
                let requestCheckResponse = await requestPromise(options);
                parsedResponse = JSON.parse(requestCheckResponse.body);
                progressStatus = parsedResponse.result.status;
            }
            if (progressStatus === "failed") throw new Error("export failed");

            // Downloading file
            let fileId = parsedResponse.result.fileId;
            let requestDownloadUrl = baseUrl + fileId + "/file";
            options = {
                method: "GET",
                url: requestDownloadUrl,
                encoding: null,
                headers: {
                    "X-API-TOKEN": req.headers["x-api-token"]
                }
            };
            request(options)
                .pipe(unzip.Parse())
                .on("entry", function(entry) {
                    // Get the file as a string
                    let chunks = [];
                    entry
                        .on("data", function(chunk) {
                            chunks.push(chunk);
                        })
                        .on("end", function() {
                            const results = JSON.parse(Buffer.concat(chunks).toString("utf8")).responses;
                            // Create responses entry
                            let responses = [];
                            for (let result of results) {
                                let values = result.values;
                                // Delete the fields we don't need from Qualtrics
                                [
                                    "startDate",
                                    "endDate",
                                    "status",
                                    "ipAddress",
                                    "duration",
                                    "recordedDate",
                                    "_recordId",
                                    "locationLatitude",
                                    "locationLongitude",
                                    "distributionChannel",
                                    "userLanguage"
                                ].forEach(key => {
                                    delete values[key];
                                });
                                let resultObj = { values: values, labels: result.labels };
                                responses.push(resultObj);
                            }

                            const collection = dbClient.db("DB1").collection("Responses");
                            collection
                                .updateOne(
                                    { surveyId: surveyId },
                                    {
                                        $set: {
                                            surveyId: surveyId,
                                            responses: responses
                                        }
                                    },
                                    { upsert: true }
                                )
                                .catch(err => {
                                    throw new Error(err);
                                });

                            res.send(results);
                        });

                    // Save the file to disk
                    // entry.pipe(fs.createWriteStream(entry.path));
                });
        }

        respond(req, res);
    })
    .post((req, res) => {
        const surveyId = req.query.surveyId;
        let hooked;

        // Check if webhook exists, update if it doesn't
        const collection = dbClient.db("DB1").collection("Projects");

        collection.findOne({ surveyId: surveyId }, function(err, result) {
            if (err) throw new Error(err);
            hooked = result.hooked;
            if (!hooked) {
                let baseUrl =
                    "https://" + process.env.VUE_APP_Q_DATA_CENTER + ".qualtrics.com/API/v3/eventsubscriptions/";
                let dataString = {
                    topics: "surveyengine.completedResponse." + surveyId,
                    publicationUrl: req.protocol + "://" + req.get("HOST") + "/api/listener?surveyId=" + surveyId,
                    encrypt: false
                };
                let options = {
                    method: "POST",
                    url: baseUrl,
                    body: JSON.stringify(dataString),
                    headers: {
                        "X-API-TOKEN": req.headers["x-api-token"],
                        "content-type": "application/json"
                    }
                };
                request(options, function(error, _, body) {
                    if (error) throw new Error(error);
                    collection.updateMany({ surveyId: surveyId }, { $set: { hooked: true } }).catch(error => {
                        throw new Error(error);
                    });

                    res.send(body);
                });
            } else {
                res.send("Webhook already exists for " + surveyId).status(200);
            }
        });
    });

//* Endpoint for MongoDB aggregate pipelines
app.route("/api/surveys/responses/aggregates").get((req, res) => {
    const surveyId = req.query.surveyId;
    const pipeline = req.query.pipeline;
    const collection = dbClient.db("DB1").collection("Responses");

    if (pipeline === "barchart") {
        collection.aggregate(Pipelines.barchartPipeline(surveyId), function(err, cursor) {
            if (err) throw new Error(err);

            cursor.toArray(function(err, docs) {
                if (err) throw new Error(err);
                res.send(docs);
            });
        });
    } else if (pipeline === "circlechart") {
        collection.aggregate(Pipelines.circlechartPipeline(surveyId), function(err, cursor) {
            if (err) throw new Error(err);

            cursor.toArray(function(err, docs) {
                if (err) throw new Error(err);
                res.send(docs);
            });
        });
    } else if (pipeline === "label") {
        return;
    }
});

//* Endpoint for handling Qualtrics events
app.route("/api/listener").post((req, res) => {
    const surveyId = req.query.surveyId;
    if (req.body.Status == "Complete") {
        io.emit(surveyId, req.body.Status);
    }
    res.sendStatus(200);
});

//* Endpoint for project documents in MongoDB
app.route("/api/projects")
    .get((_, res) => {
        const collection = dbClient.db("DB1").collection("Projects");

        collection.find({}).toArray(function(err, docs) {
            if (err) throw new Error(err);
            res.send(docs);
        });
    })
    .post((req, res) => {
        let options = {
            method: "GET",
            url: "https://" + process.env.VUE_APP_Q_DATA_CENTER + ".qualtrics.com/API/v3/surveys/" + req.body.surveyId,
            headers: {
                "X-API-TOKEN": req.headers["x-api-token"]
            }
        };
        requestPromise(options)
            .then(response => {
                const result = JSON.parse(response.body).result;
                // Create descriptions entry
                let surveyData = [];
                for (const column in result.exportColumnMap) {
                    surveyData.push({
                        title: column,
                        question: result.exportColumnMap[column].question,
                        column: result.exportColumnMap[column].column,
                        subQuestion: result.exportColumnMap[column].subQuestion
                    });
                }

                // Create choices entry
                let choicesData = [];
                for (const question in result.questions) {
                    if (result.questions[question].questionType.type === "SBS") {
                        choicesData.push(result.questions[question].columns["1"].choices);
                    }
                }

                const responsesCollection = dbClient.db("DB1").collection("Responses");
                responsesCollection
                    .updateOne(
                        { surveyId: result.id },
                        { $set: { descriptions: surveyData, choices: choicesData } },
                        { upsert: true }
                    )
                    .catch(err => {
                        throw new Error(err);
                    });

                const projectsCollection = dbClient.db("DB1").collection("Projects");
                projectsCollection
                    .insertOne(req.body)
                    .then(result => {
                        res.send(result.ops);
                    })
                    .catch(err => {
                        if (err.name === "MongoError" && err.code === 11000) {
                            return res.send("Project already exists");
                        }
                        throw new Error(err);
                    });
            })
            .catch(err => {
                throw new Error(err);
            });
    })
    .put((req, res) => {
        const collection = dbClient.db("DB1").collection("Projects");

        collection.updateOne({ projectId: req.body.previousId }, { $set: req.body.data }, function(err) {
            if (err) throw new Error(err);
            res.sendStatus(200);
        });
    })
    .delete((req, res) => {
        const collection = dbClient.db("DB1").collection("Projects");

        collection.deleteOne({ projectId: req.body.projectId }, function(err, result) {
            if (err) throw new Error(err);
            res.send({ deletedCount: result.deletedCount });
        });
    });

exports.app = app;
