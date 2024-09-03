// описать схему и модель пользователя

const mongoose = require("mongoose");
const { Schema } = mongoose;

const usersSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: "users",
    },
    following: {
        type: [Schema.Types.ObjectId],
        ref: "users",
    },
    blocks: {
        type: [Schema.Types.ObjectId],
        ref: "users",
    },
    bio: String,
    avatar: {
        type: String,
        ref: "photos",
    },
});

const users = mongoose.model("users", usersSchema);

module.exports = users;