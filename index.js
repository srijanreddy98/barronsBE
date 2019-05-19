// const {mongoose} = require('./Models/db');
const bodyParser = require('body-parser');
const express = require("express");

const app = express();
const {routes} = require('./routes');
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/dist'));
routes(app);
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist', 'index.html'));
});
app.listen(process.env.PORT || 3000, () => {console.log('Server up on port 3000')})