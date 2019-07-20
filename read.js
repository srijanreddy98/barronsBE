const fs = require('fs');
let data = fs.readFileSync('gr').toString();
data = data.split('\n');
const {google} = require('./google');
let count = 0;
let unit = 1;
let net = 0;
let main = async () => {
    let words = [];
    while(true) {
        let i = data[count];
        console.log(count,i);
        const d = i;
        let goog;
        try {
            goog = await google(d);
        } catch(e) {
            console.log(e)
        }
        let ex = {
            word: d,
            google: goog,
            id: count,
            unit: unit,
            mark1: false,
            mark2: false
        }
        words.push(ex);
        count++;
        if (count % 10 === 0) unit++;
        net++;
        if (count === 3) break;
    }
    fs.writeFileSync('all.json', JSON.stringify(words));
}

main();