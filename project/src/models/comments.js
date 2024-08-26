// описать схему и модель комментариев

const mongoose = require("mongoose");
const { Schema } = mongoose;
const users = require("./users.js");


const schema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    text: String,
    dateTime: Date,
    likes: Number,
});

const comments = mongoose.model("comments", schema);

module.exports = comments;