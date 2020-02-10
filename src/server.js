const cors = require('cors');
const express = require('express');
const path = require('path');
// const fs = require('fs');
const request = require('request');
const unzip = require('unzip-stream');
const util = require('util');
const requestPromise = util.promisify(request);

require('dotenv').config(); // Loads .env file

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000
var distDirectory;
if (port === 3000 || process.env.NODE_ENV === 'development') {
	console.log("IN DEV MODE");
	distDirectory = '../dist';
} else {
	distDirectory = 'dist';
}

// Initialize MongoDB connection using Admin user if provided, TestUser otherwise
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGO_URI || "mongodb+srv://TestUser:mochatest@invasive-species-toriy.mongodb.net/test?retryWrites=true&w=majority";
const dbClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
dbClient.connect(err => {
	if (err) throw new Error(err);
	console.log("MongoDB connected");
});

var app = express();
// Add express configurations
app.use(cors()); // Allow interaction with Vue serve and Qualtrics Web Listeners
app.use(express.urlencoded({ extended: true })); // Middleware for handling raw POST data
app.use(express.json()); // Support JSON payloads in POST requests
app.use(express.static(path.join(__dirname, distDirectory))); // Serve files in dist folder for all HTTP requests

// Start server and socket.io instance on the port
var server = app.listen(port, () => {
	console.log("Server started on port " + port);
});
var io = require('socket.io')(server);

// Any routes will be redirected to the vue app, using index.html as homepage
app.get('/', (_, res) => {
	res.sendFile(path.join(__dirname, distDirectory, '/index.html'));
});

// Endpoint for survey information
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

// Endpoint for survey response data
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
				console.log("Download is " + requestCheckProgress + "% complete");
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
					'X-API-TOKEN': req.headers['x-api-token'],
				}
			};
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
		var hooked;

		// Check if webhook exists, update if it doesn't
		const collection = dbClient.db("DB1").collection("Projects");

		collection.findOne({ surveyId: surveyId }, function(err, result) {
			if (err) throw new Error(err);
			hooked = result.hooked;
			if (!hooked) {
				collection.updateMany({ surveyId: surveyId }, { $set: { hooked: true } }, function(err) {
					if (err) throw new Error(err);

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
							'X-API-TOKEN': req.headers['x-api-token']
						}
					};
					request(options, function (error, _, body) {
						if (error) throw new Error(error);
						res.send(body);
					});
				});
			} else {
				res.send("Webhook already exists for " + surveyId).status(200);
			}
		});
	});

// Endpoint for handling Qualtrics events
app.route('/api/listener')
	.post((req, res) => {
		var surveyId = req.query.surveyId;
		if (req.body.Status == "Complete") {
			var nsp = io.of('/' + surveyId);
			nsp.emit('surveyComplete', req.body.ResponseID);
		}
		res.sendStatus(200);
	});

// Endpoint for project documents in MongoDB
app.route('/api/projects')
	.get((_, res) => {
		const collection = dbClient.db("DB1").collection("Projects");

		collection.find({}).toArray(function(err, docs) {
			if (err) throw new Error(err);
			res.send(docs);
		});
	})
	.post((req, res) => {
		const collection = dbClient.db("DB1").collection("Projects");

		collection.insertOne(req.body, function(err, result) {
			if (err) {
				if (err.name === "MongoError" && err.code === 11000) {
					return res.send("Project already exists");
				}

				throw new Error(err);
			}
			res.send(result.ops);
		});
	})
	.patch((req, res) => {
		const collection = dbClient.db("DB1").collection("Projects");

		collection.updateOne({ projectId: req.body.projectId }, { $set: req.body }, function(err) {
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
