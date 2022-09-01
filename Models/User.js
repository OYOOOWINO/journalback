const mongoose = require("mongoose")
const { Schema } = mongoose

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        min: 4
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    
    last_entry: {
        type: Date,
        required: false
    },
}, { timestamps: true })

module.exports = mongoose.model('User', User)
