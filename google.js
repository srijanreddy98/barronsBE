const cheerio = require('cheerio');
const request = require("request");
const google = (word) => {
    return new Promise((resolve, reject) => {
        var url = 'https://en.oxforddictionaries.com/search?filter=noad&query=' + word;
url = encodeURI(url);
try {
    request({
        method: 'GET',
        url: url,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0"
        }
        }, function(err, response, body) {
        
            if(err){
                reject(err);
            }
            // res.send(response);
            var $ = cheerio.load(body);
        
                    
                    
            if(!($(".hwg .hw").first()[0])){
                console.log($(".searchHeading").first().text());
               //  console.log(req.query.define + " is not present in Dictionary.");
                reject({error: "Word not found"});
            }
            
            
            var dictionary = [];
        
            var i,j = 0;
        
            var entryHead = $(".entryHead.primary_homograph");
            
            var array = [];
            if (entryHead[0] === undefined) {
                reject();
            } else {
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
                resolve(dictionary);
            }
            
            }
        });   
} catch(e) {
    reject(e)
}
    });
}

module.exports = {google};