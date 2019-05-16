const { mongoose } = require("./db");
const { Schema } = mongoose;

const wordSchema = new Schema({
    id:Number,
    word:String,
    meaning:String,
    unit:Number,
    mark1:Boolean,
    mark2:Boolean
});

const oxfordSchema = new Schema({
    id:Number,
    word: String,
    meaning: String,
    pronunciation: {
        link: String,
        phoneticSpelling: String,
    },
    example: String,
    wordType: String,
    unit:Number,
    mark1:Boolean,
    mark2:Boolean

})
let Word = mongoose.model('word', wordSchema);
let Oxford = mongoose.model('oxford', oxfordSchema);

module.exports = {Word, Oxford};
 