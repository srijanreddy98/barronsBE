const mysql = require('mysql');

const query = (query) => {
    const con1 = mysql.createPool({
        host: "localhost",
        user: "root",
        password: "chintu98",
        database: "vocabulary"
    });
    return new Promise((resolve, reject) => {
        con1.query(query, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

module.exports = {
    query
};