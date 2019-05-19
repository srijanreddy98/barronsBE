const bodyParser = require('body-parser');
const express = require('express');
// let query;
// if (process.platform == 'win32'){
//     const {query} = require('./db_windows');
// } else {
const {query} = require('./db');
// }


let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/dist'));
app.post('/api/query', (req, res) => {
    query(req.body.query).then(
        doc => res.send(doc),
        err => res.send(err)
    );
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
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
});

app.listen(3000, () => {console.log('Server up on port 3000')})