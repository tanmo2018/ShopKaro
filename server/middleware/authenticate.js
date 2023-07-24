const jwt = require("jsonwebtoken");
const USER = require("../models/userSchema");
const secretkey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.ShopKaro;

        const verifyToken = jwt.verify(token, secretkey);

        const rootUser = await USER.findOne({ _id: verifyToken._id, "tokens.token": token });

        if (!rootUser) { throw new Error("User not found!") };

        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;

        next();
    } catch (error) {
        res.status(401).send("Unautherized:No token provide");
    }
}

module.exports = authenticate;