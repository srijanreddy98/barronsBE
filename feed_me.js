// if (process.platform == 'win32'){
//     const {query} = require('./db_windows');
// } else {
    const {query} = require('./db');
// }
const fs = require('fs');
const mysql  = require('mysql')
let data = JSON.parse(fs.readFileSync('words.json'))

let main = async (data) => {
    let arr = [];
    for(let i = 151; i< data.length; i++ ) arr.push(data[i]);
    for(let i of arr) {
        // q = `insert into words (word, meaning, unit, mark1, mark2) values (?, ?,?, ?, ?);`;
        console.log(i);
        q =  mysql.format('insert into words (word, meaning, unit, mark1, mark2) values (?, ?, ?, ?, ?)', [i.word, i.meaning, i.unit, i.mark1, i.mark2]);
        await query(q);
    }
}

main(data);