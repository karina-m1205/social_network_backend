const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema({
    data: Buffer,
    contentType: String,
});

const photo = mongoose.model("photo", photoSchema);

module.exports = photo;