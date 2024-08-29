const express = require("express");
const path = require("path");
const multer = require("multer");
const photoModel = require(path.join(__dirname, "../models/photo.js"));

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single('photo'), async (req, res) => {
    try {
        const photo = new photoModel({
            data: req.file.buffer,
            contentType: req.file.mimetype,
        });

        const savedPhoto = await photo.save();
        return res.status(201).json({ photo_id: savedPhoto._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
    }
});

router.get("/:photo_id", async (req, res) => {
    try {
        const photo = await photoModel.findById(req.params.photo_id);

        if (!photo) {
            return res.status(404).send('Photo not found');
        }

        res.set('Content-Type', photo.contentType);
        return res.send(photo.data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;