const mongoose = require("mongoose")
const { Schema } = mongoose

const Journal = new Schema({
    creator_id: {
        type: String,
        required: true
    },

    content: {
        type: String,
        required: true
    },
    shared:{
        type:Boolean,
        required:true,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'created_at',
    }
})

module.exports = mongoose.model('Journal', Journal)
