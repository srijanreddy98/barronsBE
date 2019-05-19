const fs = require('fs');

let arr = ['words0_1.json', 'first.json',
'words1_2.json','words2_3.json',
'words3_4.json','words4_5.json',
'words5_6.json','words6_7.json',
'words7_8_1.json','words7_8_2.json',
'words7_8_3.json','words7_8_4.json'];
let words = [];
count = 0;
for(let i of arr) {
    let part = JSON.parse(fs.readFileSync(i).toString());
    for (let j of part) {
        if (count === 0) {
            j.id -= 300;
            j.unit -= 30;
        } else {
            if (count !== 1) {
                j.id += 1;
            }
        }
        j.unit = Math.floor((j.id - 1)/10) + 1;
        console.log(j.id, j.unit);
        words.push(j);
    }
    count++;
} 

fs.writeFileSync('worcs.json', JSON.stringify(words));
console.log(words.length);