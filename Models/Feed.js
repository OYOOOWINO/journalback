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
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now()
    }
})

module.exports = mongoose.model('Feed', Feed)
