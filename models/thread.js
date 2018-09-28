var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ThreadSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    viewsCount: {
        type: Number,
        required: true,
        default: 0
    },
    answersCount: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model('Thread', ThreadSchema);