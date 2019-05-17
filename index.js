// const {mongoose} = require('./Models/db');
const {Word, Oxford} = require('./Models/models');
const bodyParser = require('body-parser');
const express = require("express");

const app = express();

const path = require('path');
const fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/dist'));
app.post('/api/query/oxford', (req, res) => {
    const {unit} = req.body.query;
    if (req.body.query.update) {
        Oxford.findOneAndUpdate({id: req.body.query.id}, {$set:{mark1: req.body.query.mark1}}).then(doc => res.send(doc), err => res.send(err));
    } else {
        // console.log(req.query.markedWords)
        if (!req.body.query.markedWords) {
            Oxford.find({unit: unit}).then(docs => res.send(docs), err=> res.send(err));
        } else {
            Oxford.find({mark1: true}).then(docs => res.send(docs), err=> res.send(err));
        }
    }
});
app.post('/api/query/', (req, res) => {
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
app.get('/api/load/oxford', (rew, res) => {
    let final = JSON.parse(fs.readFileSync('definfed.json'));
    let oxfor =[];
    let count = 1;
    let unit = 1;
    for (let i of final) {
        // console.log(i);
        let data = i.data.results[0].lexicalEntries[0];
        let ex = {
            word: i.word,
            meaning: data.entries[0].senses && data.entries[0].senses[0].definitions ? data.entries[0].senses[0].definitions[0] : '',
            pronunciation: {
                link: data.pronunciations ? data.pronunciations[0].audioFile : '',
                phoneticSpelling: data.pronunciations ? data.pronunciations[0].phoneticSpelling : '',
            },
            example: data.entries[0].senses && data.entries[0].senses[0].examples ? data.entries[0].senses[0].examples[0].text : undefined,
            wordType: data.lexicalCategory,
            id: count,
            unit: unit,
            mark1: false,
            mark2: false
        }
        oxfor.push(ex);
        if (count % 10 === 0) unit++;
        count++;
    }
    Oxford.insertMany(oxfor).then(
        docs => res.send(docs.length.toString()),
        err => res.send(err)
    )
});
app.get('/api/check', (req, res) => {
    Word.findOneAndUpdate({id: req.body.id}).then(docs => res.send(docs), err=> res.send(err));
});
app.post('/api/addWord', (req, res) => {
    let word = new Word(req.body);
    word.save().then(
        doc => res.send(doc),
        err => res.send(err)
    )
})
app.get('/api/wordCount', (req, res) => {
    Word.countDocuments().then(
        count => {
            res.send({count, otherField: 'shit'})
        },
        err => res.send(err)
    );
})
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {console.log('Server up on port 3000')})