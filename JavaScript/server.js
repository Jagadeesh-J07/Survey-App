var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var payload =require('../payload.json');
var app = express();
app.use(bodyParser.json());
app.use(cors());
// Get Request for providing questions
app.get('/getQuestions', function (req,res,next) {
    console.log('Request received');
    res.send(payload);
    res.end();
}) 
// Post Request for getting answers
app.post('/saveSurveyDetails',function (req,res,next) {
    console.log('Request received', req.body);
    res.status(200).send("Success");
    res.end();
});
app.listen(3000);