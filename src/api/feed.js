const { clear } = require("console");
const express = require("express");
const path = require("path");
const { redisClient } = require(path.join(__dirname, "../core/redis.js"));
const usersModel = require(path.join(__dirname, "../models/users.js"));
const postsModel = require(path.join(__dirname, "../models/posts.js"));
const router = express.Router();

// router.get("/", async (req, res) => {
//     try {
//         const userId = req.userId;
//         const userFollowing = (await usersModel.findById(userId, { following: 1, _id: 0 })).following;
//         userFollowing.push(userId);
//         try {
//             const posts = await postsModel.find({ author: { $in: userFollowing } })
//                 .sort({ created: -1 })
//                 .populate("comments");
//             return res.status(200).json({ posts: posts });
//         } catch (err) {
//             return res.status(400).json({ message: err.message });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: err.message });
//     }
// });


router.get("/", async (req, res) => {
    try {
        const userId = req.userId;
        let posts;
        const cacheData = await redisClient.get("posts");
        if (cacheData) {
            console.log("data from cache");
            posts = JSON.parse(cacheData);
        } else {
            const userFollowing = (await usersModel.findById(userId, { following: 1, _id: 0 })).following;
            userFollowing.push(userId);
            try {
                console.log("data from DB");
                posts = await postsModel.find({ author: { $in: userFollowing } })
                    .sort({ created: -1 })
                    .limit(5)
                    .populate("comments");

                await redisClient.set("posts", JSON.stringify(posts), { EX: 60 });
            } catch (err) {
                return res.status(400).json({ message: err.message });
            }
        }
        return res.status(200).json({ posts: posts });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});


module.exports = router;