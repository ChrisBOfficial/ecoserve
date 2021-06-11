const cors = require("cors");
const express = require("express");
const history = require("connect-history-api-fallback");
const request = require("request");
const axios = require("axios");
const path = require("path");
const unzip = require("unzip-stream");
const util = require("util");
const helmet = require("helmet");
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
    console.log("Connected to database");
});

// Add express configurations
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies()); // Prevents Adobe Flash and Acrobat hijacking
app.use(helmet.referrerPolicy({ policy: "same-origin" })); // Hides Referer header from other sites
app.use(cors()); // Allow interaction with Vue serve and Qualtrics Web Listeners
app.use(express.urlencoded({ extended: true })); // Middleware for handling raw POST data
app.use(express.json()); // Support JSON payloads in POST requests
app.use(express.static(path.join(__dirname, distDirectory))); // Serve files in dist folder for all HTTP requests

// Start server and socket.io instance on the port
const server = app.listen(port, () => {
    console.log("Server listening on port " + port);
});
const io = require("socket.io").listen(server);

// Root route will be redirected to index.html for Vue app
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
    let targetUrl = "https://" + req.headers["q-data-center"] + ".qualtrics.com/API/v3/surveys/" + specifier;

    axios({
        method: "get",
        url: targetUrl,
        headers: {
            "X-API-TOKEN": req.headers["x-api-token"]
        }
    })
        .then(function(response) {
            if (response.status !== 200) {
                res.status(response.status).send(response);
            } else {
                res.send(response.data);
            }
        })
        .catch(function(error) {
            throw new Error(error);
        });
});

//* Endpoint for survey response data and realtime hooks
app.route("/api/surveys/responses")
    .get((req, res) => {
        // Hacking in an async function to avoid Promise hell and bc Qualtrics' API is weird
        async function respond(req, res) {
            // Create data export
            const surveyId = req.query.surveyId;
            let progressStatus = "inProgress";
            let baseUrl =
                "https://" +
                req.headers["q-data-center"] +
                ".qualtrics.com/API/v3/surveys/" +
                surveyId +
                "/export-responses/";

            let downloadRequestResponse = await axios({
                method: "post",
                url: baseUrl,
                data: { format: "json" },
                headers: {
                    "X-API-TOKEN": req.headers["x-api-token"],
                    "content-type": "application/json"
                }
            });
            let progressId = downloadRequestResponse.data.result.progressId;

            // Checking on data export progress and waiting until ready
            let parsedResponse;
            while (progressStatus !== "complete" && progressStatus !== "failed") {
                let requestCheckUrl = baseUrl + progressId;

                let requestCheckResponse = await axios({
                    method: "get",
                    url: requestCheckUrl,
                    headers: {
                        "X-API-TOKEN": req.headers["x-api-token"],
                        "content-type": "application/json"
                    }
                });

                parsedResponse = requestCheckResponse.data;
                progressStatus = parsedResponse.result.status;
            }
            if (progressStatus === "failed") throw new Error("export failed");

            // Downloading file
            let fileId = parsedResponse.result.fileId;
            let requestDownloadUrl = baseUrl + fileId + "/file";
            let options = {
                method: "GET",
                url: requestDownloadUrl,
                encoding: null,
                headers: {
                    "X-API-TOKEN": req.headers["x-api-token"]
                }
            };
            //! _REQUEST
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
                                    "status",
                                    "ipAddress",
                                    "duration",
                                    "recordedDate",
                                    "_recordId",
                                    "locationLatitude",
                                    "locationLongitude",
                                    "distributionChannel",
                                    "userLanguage",
                                    "finished",
                                    "progress"
                                ].forEach(key => {
                                    delete values[key];
                                });
                                let v = Object.values(values);
                                let email = results.indexOf(result).toString();
                                for (let i = 0; i < v.length; i++) {
                                    if (v[i].toString().includes("@")) {
                                        email = v[i];
                                    }
                                }
                                values.email = email;
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
                });
        }

        respond(req, res);
    })
    .post((req, res) => {
        const surveyId = req.query.surveyId;
        const accountToken = req.headers["x-api-token"];
        let hooked;

        // Check if webhook exists, update if it doesn't
        const collection = dbClient.db("DB1").collection("Projects");

        collection.findOne({ surveyId: surveyId, accountToken: accountToken }, function(err, result) {
            if (err) throw new Error(err);
            hooked = result.hooked;
            if (!hooked) {
                let baseUrl = "https://" + req.headers["q-data-center"] + ".qualtrics.com/API/v3/eventsubscriptions/";
                let dataString = {
                    topics: "surveyengine.completedResponse." + surveyId,
                    publicationUrl: "https://ecoserve-app.com/api/listener?surveyId=" + surveyId,
                    encrypt: false
                };

                axios({
                    method: "post",
                    url: baseUrl,
                    data: dataString,
                    headers: {
                        "X-API-TOKEN": req.headers["x-api-token"],
                        "content-type": "application/json"
                    }
                })
                    .then(function(response) {
                        if (response.status == 200) {
                            collection
                                .updateMany(
                                    { surveyId: surveyId, accountToken: accountToken },
                                    { $set: { hooked: true } }
                                )
                                .catch(error => {
                                    throw new Error(error);
                                });
                        }
                        res.send(response.data);
                    })
                    .catch(function(error) {
                        throw new Error(error);
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

    let pipelineFunction;
    if (pipeline === "barchart") {
        pipelineFunction = Pipelines.barchartPipeline(surveyId);
    } else if (pipeline === "circlechart") {
        pipelineFunction = Pipelines.circlechartPipeline(surveyId);
    }

    collection.aggregate(pipelineFunction, function(err, cursor) {
        if (err) throw new Error(err);

        cursor.toArray(function(err, docs) {
            if (err) throw new Error(err);
            res.send(docs);
        });
    });
});

//* Endpoint for handling Qualtrics events
app.route("/api/listener").post((req, res) => {
    const surveyId = req.query.surveyId;
    console.log("Event received for " + surveyId);
    io.emit(surveyId, "Complete");
    res.send("success");
});

//* Endpoint for project documents in MongoDB
app.route("/api/projects")
    .get((req, res) => {
        const projectName = req.query.name;
        const id = req.query.id;
        const accountToken = req.headers["x-api-token"];
        const collection = dbClient.db("DB1").collection("Projects");

        if (projectName === undefined && id === undefined) {
            collection.find({ accountToken: accountToken }).toArray(function(err, docs) {
                if (err) throw new Error(err);
                res.send(docs);
            });
        } else if (projectName !== undefined && id !== undefined) {
            collection.findOne({ projectId: projectName + "+" + id }, function(err, result) {
                if (err) throw new Error(err);
                res.send(result);
            });
        }
    })
    .post((req, res) => {
        axios({
            method: "get",
            url: "https://" + req.headers["q-data-center"] + ".qualtrics.com/API/v3/surveys/" + req.body.surveyId,
            headers: {
                "X-API-TOKEN": req.headers["x-api-token"]
            }
        })
            .then(function(response) {
                const result = response.data.result;
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
                        choicesData.push({
                            question: question,
                            choices: result.questions[question].columns["1"].choices
                        });
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
            .catch(function(error) {
                throw new Error(error);
            });
    })
    .put((req, res) => {
        const accountToken = req.headers["x-api-token"];
        const collection = dbClient.db("DB1").collection("Projects");

        collection.updateOne(
            { projectId: req.body.previousId, accountToken: accountToken },
            { $set: req.body.data },
            function(err) {
                if (err) throw new Error(err);
                res.sendStatus(200);
            }
        );
    })
    .delete((req, res) => {
        const accountToken = req.headers["x-api-token"];
        const collection = dbClient.db("DB1").collection("Projects");

        collection.deleteOne({ projectId: req.body.projectId, accountToken: accountToken }, function(err, result) {
            if (err) throw new Error(err);
            res.send({ deletedCount: result.deletedCount });
        });
    });

exports.app = app;
