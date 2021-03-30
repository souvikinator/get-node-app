// dotenv for easily accessing environment variables
// keep it at the top!
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// set port number
const PORT = process.env.PORT || 8080;

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

//example without file
app.get('/', function (req, res){
    res.status(200).send("for index page: /index");
});

// example with file
// index page
app.get('/index', function (req, res) {
    res.status(200).sendFile('/pages/index.html', { root: __dirname });
});

// not found
app.use((req, res) => {
    res.status(404).sendFile('/pages/notfound.html', { root: __dirname });
});

// start server
app.listen(PORT, () => {
    console.log(`server running at >${PORT}<`)
});