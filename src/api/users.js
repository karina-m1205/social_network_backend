// роутер пользователя

const express = require("express");
const path = require("path");
const usersSecvice = require(path.join(__dirname, "../services/users.js"));
const auth = require("../core/auth.js");


const router = express.Router();

router.post("/registration", async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if (typeof email !== "string") {
            return res.status(400).json({ message: "email must be a string" });
        };
        if (email.trim() === "") {
            return res.status(400).json({ message: "email required" });
        };
        const regExp = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/g;
        if (!regExp.test(email)) {
            return res.status(400).json({ message: "invalid email" });
        };
        if (typeof username !== "string") {
            return res.status(400).json({ message: "username must be a string" });
        };
        if (username.trim() === "") {
            return res.status(400).json({ message: "username required" });
        };
        if (typeof password !== "string") {
            return res.status(400).json({ message: "password must be a string" });
        };
        if (password.trim() === "") {
            return res.status(400).json({ message: "password required" });
        };

        try {
            const createdUser = await usersSecvice.createUser(email, username, password);
            return res.status(200).json(createdUser);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (typeof email !== "string") {
            return res.status(400).json({ message: "email must be a string" });
        };
        if (email.trim() === "") {
            return res.status(400).json({ message: "email required" });
        };
        const regExp = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/g;
        if (!regExp.test(email)) {
            return res.status(400).json({ message: "invalid email" });
        };
        if (typeof password !== "string") {
            return res.status(400).json({ message: "password must be a string" });
        };
        if (password.trim() === "") {
            return res.status(400).json({ message: "password required" });
        };

        const foundUser = await usersSecvice.getUser(email, password);
        if (!foundUser) {
            return res.status(400).json({ message: "invalid credentials" });
        }
        try {
            const token = auth.genToken(foundUser._id);
            return res.status(200).json({
                token: token,
                id: foundUser._id
            });
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        if (typeof userId !== "string") {
            return res.status(400).json({ message: "user id must be a string" });
        };
        if (userId.trim() === "") {
            return res.status(400).json({ message: "user id required" });
        };

        try {
            const foundUser = await usersSecvice.getUserById(userId);
            if (!foundUser) {
                return res.status(400).json({ message: "user not found" });
            };
            return res.status(200).json(foundUser);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        if (typeof userId !== "string") {
            return res.status(400).json({ message: "user id must be a string" });
        };
        if (userId.trim() === "") {
            return res.status(400).json({ message: "user id required" });
        };
        if (!updatedData) {
            return res.status(400).json({ message: "no data for update" });
        }

        try {
            const result = await usersSecvice.putUserById(userId, updatedData);
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
        const userId = req.params.id;
        if (typeof userId !== "string") {
            return res.status(400).json({ message: "user id must be a string" });
        };
        if (userId.trim() === "") {
            return res.status(400).json({ message: "user id required" });
        };

        try {
            const result = await usersSecvice.deleteUserById(userId);
            return res.status(200).json(result);
        } catch (err) {
            return res.status(400).json({ message: err.message });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;