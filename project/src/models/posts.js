// описать схему и модель постов

const mongoose = require("mongoose");
const { Schema } = mongoose;
const users = require("./users.js");
const comments = require("./comments.js");


const schema = new Schema({
    content: String,
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    likes: Number,
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "comments",
    },
    created: Date,
});

const posts = mongoose.model("posts", schema);

module.exports = posts;