const express = require('express');
const path = require('path');
var request = require('request');
require('dotenv').config();

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000,
    app = express();

var distDirectory;
if (port == 3000) {
    distDirectory = '../dist';
} else {
    distDirectory = 'dist';
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
        var targetUrl;
        if (req.query.surveyId === undefined) {
            targetUrl = 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/surveys';
        } else {
            targetUrl = 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/surveys/' + req.query.surveyId;
        }
        var options = {
            method: 'GET',
            url: targetUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': req.headers['x-api-token']
            }
        };
        request(options, function(error, _, body) {
            if (error) throw new Error(error);
            res.send(body);
        });
    })
    .post((req, res) => {
        var options = {
            method: 'POST',
            url: 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/survey-definitions',
            json: req.body,
            headers: {
                'x-api-token': req.headers['x-api-token'],
                'content-type': 'application/json',
                'Accept': 'application/json'
            },
        };
        request(options, function(error, response, body) {
            if (error) throw new Error(error);
            res.send(body);
        });
    })

//Starting server on the port
app.listen(port, () => {
    console.log("Server started on port " + port);
});
