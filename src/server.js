var port = process.env.PORT || 3000;

//Importing dependencies
const express = require('express');
var path = require('path');

//Starting Express app
const app = express();

//Set the base path to the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

//Any routes will be redirected to the vue app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//Starting server on the port
app.listen(port, () => {
    console.log('Server started!');
    console.log('on port ' + port);
});
