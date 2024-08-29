//аутентификация пользователя
require("dotenv").config();
const path = require("path");
const jwt = require("jsonwebtoken");
const SecretKey = process.env.SecretKey || "e78a5f9cafa19541bbd1131b61";
const usersModel = require(path.join(__dirname, "../models/users.js"));

function genToken(id) {
    if (!id || id === "") {
        throw new Error("id required");
    }
    try {
        const token = jwt.sign({ id: id }, SecretKey);
        return token;
    } catch (err) {
        throw err;
    }
}

function verifyToken(req, res, next) {
    const auth = req.headers["authorization"];
    if (!auth) {
        return res.status(401).json({ message: "token is required" });
    }

    const token = auth.split(" ")[1];
    jwt.verify(token, SecretKey, (err, data) => {
        if (err) {
            return res.status(401).send("Invalid token");
        };
        // if (req.query.id !== data.id) {
        //     return res.status(403).json({ message: "do not have permission to access this resource" })
        // }
        req.userId = data.id;
        return next();
    });
}

module.exports.genToken = genToken;
module.exports.verifyToken = verifyToken;