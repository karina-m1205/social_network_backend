const express = require("express");
const path = require("path");
const usersModel = require(path.join(__dirname, "../models/users.js"));
const postsModel = require(path.join(__dirname, "../models/posts.js"));
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const userId = req.userId;
        const userFollowing = (await usersModel.findById(userId, { following: 1, _id: 0 })).following;
        userFollowing.push(userId)
        try {
            const posts = await postsModel.find({ author: { $in: userFollowing } })
            .populate("comments");
            return res.status(200).json({ posts: posts });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;