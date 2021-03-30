// dotenv for easily accessing environment variables
// keep it at the top!
require('dotenv').config();
const express = require('express');
const app = express();
const path= require('path');

// set port number
const PORT = process.env.PORT || 8080;

// serving static files
app.use('/static', express.static(path.join(__dirname, 'public')));
// set the view engine to ejs
app.set('view engine', 'ejs');

// index page
app.get('/', function (req, res) {
    res.status(200).render('pages/index', {
        title: "index | create-express-app",
        emoji: "🥳",
        message: "Everything Works Fine!"
    });
});

// not found
app.use((req, res) => {
    res.status(404).render('pages/index', {
        title: "not found | create-express-app",
        emoji: "😫",
        message: "404 NOT FOUND"
    });
});


app.listen(PORT, () => {
    console.log(`server running at >${PORT}<`)
});