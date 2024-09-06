require("dotenv").config({path: "../../.env"});
const redis = require("redis");
const redisURI = process.env.redisURI;
const redisClient = redis.createClient({url: redisURI});

module.exports.redisClient = redisClient;