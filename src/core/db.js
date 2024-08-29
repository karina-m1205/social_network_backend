// connection к базе данных
require("dotenv").config();
const mongoose = require("mongoose");
const URI = process.env.mongodbURI || "mongodb://localhost:27017/social_network_backend";



const db = mongoose.connect(URI);

module.exports = db;
