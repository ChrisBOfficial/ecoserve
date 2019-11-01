var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express();

var log = function(entry) {
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

app.use(express.static('www', {index: 'main.html'}));

app.post('/', function(req, res) {
    var body = '';

    req.on('data', function(chunk) {
        body += chunk;
    });

    req.on('end', function() {
        if (req.url === '/') {
            log('Received message: ' + body);
        } else if (req.url = '/scheduled') {
            log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
        }

        res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
        res.end();
    });
});

// Listen on port 3000, IP defaults to 127.0.0.1
var server = app.listen(port, function() {
    // Put a friendly message on the terminal
    console.log('Server running at http://127.0.0.1:' + port + '/');
})
