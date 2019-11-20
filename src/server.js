const express = require('express');
const path = require('path');
require('dotenv').config();

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000,
    app = express();

if (port == 3000) {
    // Serve files in dist folder for all HTTP requests
    app.use(express.static(path.join(__dirname, '../dist')));
    // Any routes will be redirected to the vue app, using index.html as homepage
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
} else {
    // Serve files in dist folder for all HTTP requests
    app.use(express.static(path.join(__dirname, 'dist')));
    // Any routes will be redirected to the vue app, using index.html as homepage
    app.get('*', (_, res) => {
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}

/*
res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
*/

//Starting server on the port
app.listen(port, () => {
    console.log("Server started!");
    console.log("Running on port " + port);
});
