const cheerio = require("cheerio");
const request = require('request');
const {Word, Oxford} = require('./Models/models');
const fs = require('fs');
let routes = (app) => {
    app.post('/api/query/oxford', (req, res) => {
        const {unit} = req.body.query;
        if (req.body.query.update) {
            Oxford.findOneAndUpdate({id: req.body.query.id}, {$set:{mark1: req.body.query.mark1}}).then(doc => res.send(doc), err => res.send(err));
        } else {
            // console.log(req.query.markedWords)
            if (!req.body.query.markedWords) {
                Oxford.find({unit: { "$in": unit }}).then(docs => res.send(docs), err=> res.send(err));
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
            if (!req.body.query.markedWords && !req.query.doubleMarked) {
                Word.find({unit: { "$in": unit }}).then(docs => res.send(docs), err=> res.send(err));
            } else if (req.query.doubleMarked) {
                Word.find({mark2: true, unit: { "$in": unit }}).then(docs => res.send(docs), err=> res.send(err));
            }
             else {
                Word.find({mark1: true, unit: { "$in": unit }}).then(docs => res.send(docs), err=> res.send(err));
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
        let allWords = JSON.parse(fs.readFileSync('worcs.json'));
        allWords.forEach(element => {
            element.google = JSON.stringify(element.google);
        });
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
    app.get("/google", function(req, res){
        if(!req.query.define){
            // res.sendFile(path.join(__dirname+'/views//index.html'));
            res.status(400).send("Define not present")
        }  else {     
             var url = 'https://en.oxforddictionaries.com/search?filter=noad&query=' + req.query.define;
             // if(req.query.lang){
             //   url =  url.replace('en', req.query.lang);
             //   if(req.query.lang === "hi"){
             //       url =  url.replace('define', 'matlab');
             //   }
             // }
             
             url = encodeURI(url);
     
             request({
             method: 'GET',
             url: url,
             headers: {
                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0"
             }
         }, function(err, response, body) {
             
                 if(err){
                     return console.error(err);
                 }
                 // res.send(response);
                 var $ = cheerio.load(body);
     
                         
                         
                 if(!($(".hwg .hw").first()[0])){
                     console.log($(".searchHeading").first().text());
                    //  console.log(req.query.define + " is not present in Dictionary.");
                     res.header("Access-Control-Allow-Origin", "*");
                     return res.status(404).send({error: "Word not found"});
                 }
                 
                 
                 var dictionary = [];
     
                 var i,j = 0;
     
                 var entryHead = $(".entryHead.primary_homograph");
                 
                 var array = [];
                 var entriesOfFirstEntryHead = $("#" + entryHead[0].attribs.id + " ~ .gramb").length;
                 //console.log(entriesOfFirstEntryHead);
                 for(i = 0; i < entryHead.length; i++){
                     array[i]  =   entriesOfFirstEntryHead - $("#" + entryHead[i].attribs.id + " ~ .gramb").length;
                 }
                 array[i] = entriesOfFirstEntryHead;
                 //console.log(array);
                 
                 var grambs = $("section.gramb");
     
                 var numberOfentryGroup = array.length - 1;
     
                 for(i = 0; i < numberOfentryGroup; i++){
                     var entry = {};
                     
                     var word  = $(".hwg .hw")[i].childNodes[0].nodeValue;
                     entry.word = word;
                     //console.log(entry.word);
                     
                     var phonetic  = $(".pronSection.etym .pron .phoneticspelling")[i];
                     if(phonetic){
                         entry.phonetic = phonetic.childNodes[0].data;
                     }
                     
                     entry.meaning = {};
                     
                     //var numberOfGrambs = array[i + 1] - array[i];
                     var start  = array[i];
                     var end = array[i + 1];
     
                     for(j = start; j < end; j++){
     
                             var partofspeech = $(grambs[j]).find(".ps.pos .pos").text();
                             $(grambs[j]).find(".semb").each(function(j, element){
                                 var meaningArray = [];
                                 $(element).find("> li").each(function(j, element){
                                     
                                     var item = $(element).find("> .trg");
                                     
                                     var definition = $(item).find(" > p > .ind").text();
                                     if(definition.length  === 0){
                                         definition = $(item).find(".crossReference").first().text();
                                     }
                                     var example = $(item).find(" > .exg  > .ex > em").first().text();
                                     var synonymsText = $(item).find(" > .synonyms > .exg  > .exs").first().text();
                                     var synonyms = synonymsText.split(/,|;/).filter(synonym => synonym!= ' ' && synonym).map(function(item) {
                                                      return item.trim();
                                                    });
                                                    
                                     var newDefinition = {};
                                     if(definition.length > 0)
                                         newDefinition.definition = definition;
                                                                                
                                     if(example.length > 0)
                                         newDefinition.example = example.substring(1, example.length - 1);
                                     
                                     if(synonyms.length > 0)
                                         newDefinition.synonyms = synonyms;
         
                                     meaningArray.push(newDefinition);
         
                                 });
     
                                 if(partofspeech.length === 0)
                                     partofspeech = "crossReference";
                                     
                                 entry.meaning[partofspeech] = meaningArray.slice();
                             });
                                 
                     }
                     dictionary.push(entry);
                 }
                 
          
                 
                 Object.keys(dictionary).forEach(key => {(Array.isArray(dictionary[key]) && !dictionary[key].length) && delete dictionary[key]});
                 
                 if($(".hwg .hw").first()[0]){
                     res.header("Content-Type",'application/json');
                     res.header("Access-Control-Allow-Origin", "*");
                     res.send(JSON.stringify(dictionary, null, 4));
                 }
         
                 
             });
         }
     });
}

module.exports = {routes};