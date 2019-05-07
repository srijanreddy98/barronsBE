const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:chintu98@ds151596.mlab.com:51596/vocabulary', { useNewUrlParser: true });

module.exports = {mongoose};