const mongoose = require("mongoose")
const { Schema } = mongoose

const Feed = new Schema({
    target_id: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Feed', Feed)
