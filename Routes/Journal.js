const router = require("express").Router()
const Journal = require("../Models/Journal")
const { authenticateJWT } = require("../middlewares/authorization.js")

const { body, validationResult } = require('express-validator')
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config()

// save journal
router.post("/save", authenticateJWT, [body('content', 'Content cannot be blank').notEmpty()],
    async (req, res, next) => {
        try {
            // Check for validation errors
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            // save Journal
            let entry = req.body
            const journal = await new Journal(entry)

            const registered = await journal.save()

            // check if user has been saved
            if (registered) {
                return res.status(200).json({ message: 'Journal Saved' })
            } else {
                return res.status(500).json({ message: 'Error Saving Journal' })
            }
        } catch (error) {
            // add logging utility here
        }
    })

router.post("/get", authenticateJWT, [body('_id', 'Content cannot be blank').notEmpty()],
    async (req, res, next) => {
        try {
            // Check for validation errors
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            const journals = await Journal.find({ creator_id: req.body._id }).sort({ created_at: -1 }).limit(5);;
            return res.status(200).json({ journals })

        } catch (error) {
            // add logging utility here
        }
    })

router.post("/get_ts", authenticateJWT, [body('_id', 'Content cannot be blank').notEmpty(), body('date', 'Dates cannot be blank').notEmpty()],
    async (req, res, next) => {
        try {
            // Check for validation errors
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }

            let dates = req.body.date
            // console.log(dates);
            const journals = await Journal.find({
                creator_id: req.body._id, created_at: {
                    $gt: new Date(dates[0]),
                    $lt: new Date(dates[1])
                }
            }).sort({ created_at: -1 });;
            // console.log(journals);
            return res.status(200).json({ journals })

        } catch (error) {
            console.log(error)
        }
    })

module.exports = router
