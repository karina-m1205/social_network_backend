const express = require("express");
const path = require("path");
const postsModel = require(path.join(__dirname, "../models/posts.js"));
const commentsModel = require(path.join(__dirname, "../models/comments.js"));
const router = express.Router();

// {commentId: "..."} or {postId: "..."} 
router.post("/", async (req, res) => {
    try {
        const userId = req.userId;
        let result = {};
        if (req.body.commentId) {
            const commentId = req.body.commentId;
            result = await commentsModel.updateOne(
                { _id: commentId },
                { $inc: { likes: 1 } }
            );
        }
        if (req.body.postId) {
            const postId = req.body.postId;
            result = await postsModel.updateOne(
                { _id: postId },
                { $inc: { likes: 1 } }
            );
        }
        return res.status(200).json({ message: "ok", result: result });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;