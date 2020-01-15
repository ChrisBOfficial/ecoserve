const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);
require('dotenv').config();

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000,
    app = express();

var distDirectory;
var projectsDir;
if (port == 3000) {
    distDirectory = '../dist';
    projectsDir = path.join(__dirname, '/assets/projects.json');
} else {
    distDirectory = 'dist';
    projectsDir = path.join(__dirname, 'projects.json');
}

if (process.env.NODE_ENV == 'development') {
    console.log("IN DEV MODE");
}

// Enables requests from Vue serve 
if (process.env.NODE_ENV == 'development') {
    app.use(cors());
}
// Support JSON payloads in POST requests
app.use(express.json());
// Serve files in dist folder for all HTTP requests
app.use(express.static(path.join(__dirname, distDirectory)));
// Any routes will be redirected to the vue app, using index.html as homepage
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, distDirectory, '/index.html'));
});

app.route('/api/surveys')
    .get((req, res) => {
        var specifier;
        if (req.query.surveyId === undefined) {
            specifier = '';
        } else {
            specifier = req.query.surveyId;
        }
        var targetUrl = 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/surveys/' + specifier;
        var options = {
            method: 'GET',
            url: targetUrl,
            headers: {
                'content-type': 'application/json',
                'X-API-TOKEN': req.headers['x-api-token']
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
    })

app.route('/api/surveys/responses')
    .get((req, res) => {
        async function respond(req, res) {
            // Create data export
            var surveyId = req.query.surveyId;
            var requestCheckProgress = 0.0;
            var progressStatus = "inProgress";
            var baseUrl = 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/surveys/' + surveyId + '/export-responses/';
            var options = {
                method: 'POST',
                url: baseUrl,
                json: {"format": "json"},
                headers: {
                    'content-type': 'application/json',
                    'X-API-TOKEN': req.headers['x-api-token']
                }
            };
            var downloadRequestResponse = await requestPromise(options);
            var progressId = downloadRequestResponse.body.result.progressId;
            console.log(downloadRequestResponse.body);
            
            // Checking on data export progress and waiting until ready
            while(progressStatus !== "complete" && progressStatus !== "failed") {
                console.log("progressStatus=" + progressStatus);
                var requestCheckUrl = baseUrl + progressId;
                delete options.json;
                options = {
                    method: 'GET',
                    url: requestCheckUrl,
                    headers: {
                        'content-type': 'application/json',
                        'X-API-TOKEN': req.headers['x-api-token']
                    }
                };
                var requestCheckResponse = await requestPromise(options);
                var parsedResponse = JSON.parse(requestCheckResponse.body);
                requestCheckProgress = parsedResponse.result.percentComplete;
                console.log("Download is " + requestCheckProgress + " complete");
                progressStatus = parsedResponse.result.status;
            }

            // Check for error
            if (progressStatus === "failed") throw new Error("export failed");

            var fileId = parsedResponse.result.fileId;

            // Downloading file
            var requestDownloadUrl = baseUrl + fileId + '/file';
            options = {
                method: 'GET',
                url: requestDownloadUrl,
                headers: {
                    'content-type': 'application/json',
                    'X-API-TOKEN': req.headers['x-api-token'],
                }
            };
            // var requestDownload = await requestPromise(options);
            request(options, function(err, response) {
                if (err) throw new Error(err);
                console.log(response.body);
                const file = fs.createWriteStream('responses.json');
                response.pipe(file);
            });
        }

        respond(req, res);
    })

app.route('/api/projects')
    .get((_, res) => {
        var projects = JSON.parse(fs.readFileSync(projectsDir));
        res.send(projects);
    })
    .post((req, res) => {
        var projects = JSON.parse(fs.readFileSync(projectsDir));
        projects[req.body.name] = req.body.data;
        fs.writeFileSync(projectsDir, JSON.stringify(projects, null, 4));
        res.send(projects);
    })
    .delete((req, res) => {
        var projects = JSON.parse(fs.readFileSync(projectsDir));
        delete projects[req.body.name];
        fs.writeFileSync(projectsDir, JSON.stringify(projects, null, 4));
        res.send(projects);
    })

//Starting server on the port
app.listen(port, () => {
    console.log("Server started on port " + port);
});

exports.app = app;
