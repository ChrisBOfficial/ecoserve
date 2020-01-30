const cors = require('cors');
const express = require('express');
const fs = require('fs');
const path = require('path');
const request = require('request');
const unzip = require('unzip-stream');
const util = require('util');

const requestPromise = util.promisify(request);
require('dotenv').config();

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000,
	app = express();

var distDirectory;
var projectsDir;
if (port === 3000) {
	distDirectory = '../dist';
	projectsDir = path.join(__dirname, '/assets/projects.json');
} else {
	distDirectory = 'dist';
	projectsDir = path.join(__dirname, 'projects.json');
}

if (process.env.NODE_ENV === 'development') {
	console.log("IN DEV MODE");
}

app.use(express.urlencoded({extended: true})); // Middleware for handling raw POST data
app.use(cors()); // Allow interaction with Vue serve and Qualtrics Web Listeners
app.use(express.json()); // Support JSON payloads in POST requests
app.use(express.static(path.join(__dirname, distDirectory))); // Serve files in dist folder for all HTTP requests
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
		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			if (response.statusCode !== 200) {
				res.status(response.statusCode).send(response);
			} else {
				res.send(body);
			}
		});
	});

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
			while (progressStatus !== "complete" && progressStatus !== "failed") {
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
				encoding: null,
				headers: {
					'content-type': 'application/json',
					'X-API-TOKEN': req.headers['x-api-token'],
				}
			};
			// var requestDownload = await requestPromise(options);
			request(options)
			// Parse the zipfile
				.pipe(unzip.Parse())

				// For each file in the zipfile
				.on('entry', function (entry) {

					// Get the file as a string
					const chunks = [];
					entry.on('data', function (chunk) {
						chunks.push(chunk);
					}).on('end', function () {
						const results = JSON.parse(Buffer.concat(chunks).toString('utf8')).responses;
						res.send(results);
					});

					// Save the file to disk
					// entry.pipe(fs.createWriteStream(entry.path));
				});
		}

		respond(req, res);
	})
	.post((req, res) => {
		var surveyId = req.query.surveyId;
		var baseUrl = 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/eventsubscriptions/';
		var dataString = {
			'topics': 'surveyengine.completedResponse.' + surveyId,
			'publicationUrl': req.protocol + '://' + req.get('HOST') + '/api/listener?surveyId=' + surveyId,
			'encrypt': false
		}
		var options = {
			method: 'POST',
			url: baseUrl,
			body: JSON.stringify(dataString),
			headers: {
				'content-type': 'application/json',
				'X-API-TOKEN': req.headers['x-api-token']
			}
		};
		request(options, function (error, response, body) {
			if (error) throw new Error(error);
			res.send(body);
		});
	});

app.route('/api/listener')
	.post((req, res) => {
		var surveyId = req.query.surveyId;
		if (req.body.Status == "Complete") {
			io.emit('SV_3yOO65TG4UFqw6N', "Survey completed!");
		}
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
	});

// Starting server and socket.io instance on the port
var server = app.listen(port, () => {
	console.log("Server started on port " + port);
});
var io = require('socket.io')(server);

exports.app = app;
