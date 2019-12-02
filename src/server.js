const express = require('express');
const path = require('path');
const fs = require('fs');
var request = require('request');
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

//Starting server on the port
app.listen(port, () => {
    console.log("Server started on port " + port);
});

exports.app = app;
