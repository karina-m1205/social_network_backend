require("dotenv").config();
const express = require("express");
const path = require("path");
const connectToDB = require(path.join(__dirname, "./core/db.js"));
const usersRouter = require(path.join(__dirname, "./api/users.js"));
const postsRouter = require(path.join(__dirname, "./api/posts.js"));
const commentsRouter = require(path.join(__dirname, "./api/comments.js"));
const feedRouter = require(path.join(__dirname, "./api/feed.js"));
const auth = require(path.join(__dirname, "./core/auth.js"));


const app = express();
const PORT = process.env.PORT || 3000;

connectToDB.then((db) => {
    console.log("connect to DB");
})


app.use(express.json());
app.use(express.text());
app.post("/registration", usersRouter);
app.post("/login", usersRouter);
app.use("/users", auth.verifyToken, usersRouter);
app.use("/posts",auth.verifyToken, postsRouter);
app.use("/comments", commentsRouter);
// app.use("/feed", feedRouter);


app.listen(PORT, () => {
    console.log(`app running on http://localhost:${PORT}`);
})