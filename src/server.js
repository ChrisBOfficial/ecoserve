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

// Serve files in dist folder for all HTTP requests
app.use(express.static(path.join(__dirname, distDirectory)));
// Any routes will be redirected to the vue app, using index.html as homepage
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, distDirectory, '/index.html'));
});

app.route('/api/surveys')
    .get((req, res) => {
        var options = {
            method: 'GET',
            url: 'https://' + process.env.VUE_APP_Q_DATA_CENTER + '.qualtrics.com/API/v3/surveys',
            headers: {
                'Content-Type': 'application/json',
                'X-API-TOKEN': req.headers['x-api-token']
            }
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
