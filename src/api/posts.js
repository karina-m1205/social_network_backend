// роутер постов

const express = require("express");
const path = require("path");
const postsSecvice = require(path.join(__dirname, "../services/posts.js"));

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const userId = req.userId;
        const postData = req.body;
        try {
            const result = await postsSecvice.createPost(userId, postData);
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
        const postId = req.params.id;
        try {
            const result = await postsSecvice.getPostById(postId);
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
        const postId = req.params.id;
        const updatedData = req.body;
        try {
            const result = await postsSecvice.putPostById(userId, postId, updatedData);
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
        const postId = req.params.id;
        try {
            const result = await postsSecvice.deletePostById(userId, postId);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;