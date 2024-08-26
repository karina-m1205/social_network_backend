// роутер постов

const express = require("express");
const path = require("path");
const commentsSecvice = require(path.join(__dirname, "../services/comments.js"));

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const userId = req.userId;
        const commentData = req.body;
        try {
            const result = await commentsSecvice.createComment(userId, commentData);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const commentId = req.params.id;
        try {
            const result = await commentsSecvice.getCommentById(commentId);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const userId = req.userId;
        const commentId = req.params.id;
        const updatedData = req.body;
        try {
            const result = await commentsSecvice.putCommentById(userId, commentId, updatedData);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.userId;
        const commentId = req.params.id;
        try {
            const result = await commentsSecvice.deleteCommentById(userId, commentId);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;