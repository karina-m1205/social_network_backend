const mongoose = require("mongoose");
const { Schema } = mongoose;

const photoSchema = new Schema({
    data: Buffer,
    contentType: String,
});

const photos = mongoose.model("photos", photoSchema);

module.exports = photos;