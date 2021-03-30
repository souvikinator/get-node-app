// dotenv for easily accessing environment variables
// keep it at the top!
require('dotenv').config();
const express = require('express');
const app = express();
const todoRoute=require('./routes/todo');
const cors=require('cors');
const doc=require('./models/doc');

// set port number
const PORT = process.env.PORT || 8080;
// to allow cross-origin requests
app.use(cors());

// api endpoint accessible from /todo/...
app.use("/todo",todoRoute);

app.get('/',(req,res)=>{
    res.status(200).send(doc);
});

// start server
app.listen(PORT, () => {
    console.log(`server running at >${PORT}<`)
});