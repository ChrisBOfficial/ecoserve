const express = require('express');
const path = require('path');

// Use AWS port if provided, 3000 otherwise
var port = process.env.PORT || 3000,
    app = express();

// Serve files in dist folder for all HTTP requests
app.use(express.static(path.join(__dirname, 'dist')));

// Any routes will be redirected to the vue app, using index.html as homepage
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Starting server on the port
app.listen(port, () => {
    console.log("Server started!");
    console.log("Running on port " + port);
});
