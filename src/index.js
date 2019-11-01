var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
    express = require('express'),
    app = express();

app.use(express.static('www', {index: 'main.html'}));

// Listen on port 3000, IP defaults to 127.0.0.1
var server = app.listen(port, function() {
    // Put a friendly message on the terminal
    console.log('Server running at http://127.0.0.1:' + port + '/');
})
