const fs = require('fs');
let data = fs.readFileSync('a.csv').toString();
data = data.split('\n');
const {google} = require('../google');
let count = 100;
let unit = 11;
let net = 0;
let main = async () => {
    let words = [];
    while(true) {
        let i = data[count];
        console.log(count);
        const d = i.split(',');
        let goog;
        try {
            goog = await google(d[0]);
        } catch(e) {
            console.log(e)
        }
        let ex = {
            word: d[0],
            meaning: d[1],
            google: goog,
            id: count,
            unit: unit,
            mark1: false,
            mark2: false
        }
        words.push(ex);
        if (count % 10 === 0) unit++;
        count++;
        net++;
        if (net === 1) break;
    }
    fs.writeFileSync('first.json', JSON.stringify(words));
}

main();