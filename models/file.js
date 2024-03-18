const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/FileUpload")

const file = mongoose.Schema({
    path: {
        type: String,
        required: true,
    },
    originalName: {
        type: String,
        required: true,
    },
    password: {
        type: String
    }
})

module.exports = mongoose.model('File', file);