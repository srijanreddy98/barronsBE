const fs = require('fs');
let data = fs.readFileSync('a.csv').toString();
data = data.split('\n');
const {google} = require('../google');
let count = 781;
let unit = 78;
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
        if (net === 19) break;
    }
    fs.writeFileSync('words7_8_4.json', JSON.stringify(words));
}

main();