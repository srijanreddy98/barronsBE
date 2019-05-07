const { mongoose } = require("./db");
const { Schema } = mongoose;

const wordSchema = new Schema({
    comments: Number,
    likes: Number,
    id:Number,
    word:String,
    meaning:String,
    unit:Number,
    mark1:Boolean,
    mark2:Boolean
});
let Word = mongoose.model('word', wordSchema);

module.exports = {Word};
 