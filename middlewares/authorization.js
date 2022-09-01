const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

dotenv.config()

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(req.headers);
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                res.status(403).send({ message: "Authorization Needed"});
            }
            next();
        });
    } else {
        res.status(401).send({ message: "Not Authorised"});
    }
};

module.exports  = {authenticateJWT}