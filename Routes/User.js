const router = require("express").Router()
const User = require("../Models/User")
const { body, validationResult } = require('express-validator')
const { authenticateJWT } = require("../middlewares/authorization.js")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config()

// Register user
router.post("/register", [body('email', 'Email is not valid').isEmail().normalizeEmail({ remove_dots: false }),
body('email', 'Email cannot be blank').notEmpty(),
body('password', 'Password must be at least 4 characters long').isLength({ min: 5 })
],
    async (req, res, next) => {
        try {
            // Check for validation errors
            var errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json(errors.array());
            }
            //check if user email exists
            const userExist = await User.findOne({ email: req.body.email })
            if (userExist) {
                return res.status(409).json({ message: 'The email address already registered.' })
            };
            // register user
            const user = await new User({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 8),
            })
            const registered = await user.save()

            // check if user has been saved
            if (registered) {
                return res.status(200).json({ message: 'Registration Successful' })
            } else {
                return res.status(500).json({ message: 'Registration Error' })
            }
        } catch (error) {
            // add logging utility here
        }
    })

// Login User
router.post("/login", async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: "Invalid email or Password." });
        }
        
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ message: "Invalid Email or Password" });

        let token = jwt.sign({ id: user._id, name: user.username }, process.env.SECRET, {
            expiresIn: 86400 // expires in 24 hours
        });
        // console.log("Hello");
        let userData = {}
        userData._id = user._id
        userData.email = user.email
        userData.authToken = token
        
        res.status(200).send({ message: "Login Success", userData });
    } catch (error) {
        console.log(error);
    }
})

router.patch("/update",authenticateJWT, async (req, res, next) => {
   
    try {
        const user = await User.findOne({ _id: req.body._id });
        if (!user) {
            return res.status(404).send({ message: "No such User" });
        }
        
        let current_time = Date.now();
        let user_id = req.body._id

        await User.updateOne({_id:user_id},{last_entry:current_time})
        res.status(200).send({ message: "Update Successful" });
    } catch (error) {
        console.log(error);
    }
})
module.exports = router
