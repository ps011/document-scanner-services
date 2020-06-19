const mongoose = require('../utils/database-connector').getMongoose();
const Schema = mongoose.Schema;


const docSchema = new Schema({
    name: String,
    user: {
        type: String,
    },
    url: {
        type: String
    },
    tags: {
        type: [String],
    },
    category: String,
    size: Number,
    format: {
        type: String,
    }
}, {timestamps: true});

module.exports = mongoose.model('Doc', docSchema);
