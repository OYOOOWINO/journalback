const router = require("express").Router()
const Feed = require("../Models/Feed")
const { authenticateJWT } = require("../middlewares/authorization.js")
const { body, validationResult } = require('express-validator')
const dotenv = require("dotenv")

dotenv.config()

// get feeds
router.post("/get", authenticateJWT, [body('_id', 'Content cannot be blank').notEmpty()],
    async (req, res, next) => {
        try {
            // Check for validation errors
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            // get query Range TS
            let current_millis = Date.now();
            let prev_time = new Date(current_millis - (24 * 3600000))
            let current_time = new Date(current_millis)

            const feeds = await Feed.find({ target_id: req.body._id, created_at: { $gt: prev_time, $lt: current_time } });
            return res.status(200).json({ feeds })

        } catch (error) {
            // add logging utility here
        }
    })

module.exports = router
