// const {mongoose} = require('./Models/db');
const {Word} = require('./Models/models');
const bodyParser = require('body-parser');
const express = require("express");

const app = express();

const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/dist'));
app.post('/api/query', (req, res) => {
    const {unit} = req.body.query;
    if (req.body.query.update) {
        Word.findOneAndUpdate({id: req.body.query.id}, {$set:{mark1: req.body.query.mark1}}).then(doc => res.send(doc), err => res.send(err));
    } else {
        // console.log(req.query.markedWords)
        if (!req.body.query.markedWords) {
            Word.find({unit: unit}).then(docs => res.send(docs), err=> res.send(err));
        } else {
            Word.find({mark1: true}).then(docs => res.send(docs), err=> res.send(err));
        }
    }
});
app.get('/api/backup', (req, res) => {
    query('select * from words').then(
        doc => {
            fs.writeFileSync('words.json', JSON.stringify(doc));
            res.send('Success');
        },
        err => res.send(err)
    )
});
app.get('/api/load', (req, res) => {
    let allWords = JSON.parse(fs.readFileSync('words.json'));
    Word.insertMany(allWords).then(
        docs => res.send(docs),
        err => res.send(err)
    )
    // res.send(allWords);
});
app.get('/api/check', (req, res) => {
    Word.findOneAndUpdate({id: req.body.id}).then(docs => res.send(docs), err=> res.send(err));
});
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {console.log('Server up on port 3000')})