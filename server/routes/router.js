require("dotenv").config();
const express = require("express");
const router = express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");
const bcrypt = require("bcrypt");
const Razorpay = require("razorpay");
const authenticate = require("../middleware/authenticate");


var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});

//get product data api
router.get("/getproducts", async (req, res) => {
    try {
        const productdata = await Products.find();
        // console.log(productdata);
        res.status(201).json(productdata);
    } catch {
        console.log("error" + error.message);
    }
});

//get individual data
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const individualdata = await Products.findOne({ id: id });
        res.status(201).json(individualdata);
        // console.log(individualdata);
    }
    catch (error) {
        console.log("error" + error.message);

    }
});

router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    try {
        if (!fname || !email || !mobile || !password || !cpassword) {
            res.status(422).json({ error: "Fill the all field!" });
            console.log("Empty field!")
        } else {
            const preUser = await USER.findOne({ email: email });

            if (preUser) {
                res.status(422).json({ error: "This mail is already registered!" });
            } else if (password != cpassword) {
                res.status(422).json({ error: "Mismatch in Confirm password and Password " });
            } else {
                const finalUser = new USER({
                    fname, email, mobile, password, cpassword
                });
                const storeData = await finalUser.save();
                // console.log(storeData);

                res.status(201).json(storeData);
            }
        }

    } catch (error) {
        res.status(401).json(error.message);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: "fill the all data" });
        } else {
            const userLogin = await USER.findOne({ email: email });
            // console.log(userLogin);
            if (userLogin) {
                const isMatch = await bcrypt.compare(password, userLogin.password);
                // console.log(isMatch);

                if (!isMatch) {
                    res.status(400).json({ error: "Invalid password" });
                } else {
                    //generate token
                    const token = await userLogin.generateAuthtoken();
                    // console.log(token);
                    //great learning
                    res.cookie("ShopKaro", token, {
                        expires: new Date(Date.now() + 9000000000),
                        httpOnly: true, //http
                        secure: true, //https
                        sameSite: "none" //third party
                    });
                    res.status(201).json(userLogin);
                }
            } else {
                res.status(400).json(error.message);
            }
        }
    } catch {
        res.status(400).json({ error: "Invalid details" });
    }
})

router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        // console.log(req.token);

        const cart = await Products.findOne({ id: id });
        // console.log(cart);

        const UserContact = await USER.findOne({ _id: req.userID });

        if (UserContact) {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
            // console.log(cartData);
            res.status(201).json(UserContact);
        } else {
            res.status(401).json({ error: "Invalid user!" });
        }

    } catch {
        res.status(401).json({ error: "Invalid user!" });
    }
})

//get cart details
router.get("/cartdetails", authenticate, async (req, res) => {
    try {
        const buyuser = await USER.findOne({ _id: req.userID });
        res.status(201).json(buyuser);
    } catch (error) {
        console.log("error" + error);
        res.status(401).json("error");
    }
})

//get valid user
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const validuserone = await USER.findOne({ _id: req.userID });
        res.status(201).json(validuserone);

    } catch (error) {
        console.log("error" + error);
    }
})

//remove item from cart
router.delete("/remove/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params;

        req.rootUser.carts = req.rootUser.carts.filter((curval) => {
            return curval.id != id;
        })

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("item remove");
    } catch (error) {
        res.status(400).json(req.rootUser);
        console.log("error" + error);
    }
})

//user logout

router.get("/logout", authenticate, (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curtoken) => {
            return curtoken.token != req.token;
        });

        res.clearCookie("ShopKaro", { path: "/" });

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("user logout");
    } catch (error) {
        console.log("error for user logout! ");
    }
})

//order creation
router.post("/create/orderId", authenticate, (req, res) => {
    try {
        // console.log("create order request", req.body);
        var options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "rcp1"
        };
        instance.orders.create(options, function (err, order) {
            // console.log(order);
            res.send({ orderId: order.id });
        });
    }
    catch (error) {
        console.log("Error in order creation!");
    }
})

//remove all item from cart
router.delete("/removeall", authenticate, async (req, res) => {
    try {
        req.rootUser.carts = [];
        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("items removed");
    } catch (error) {
        res.status(400).json(req.rootUser);
        console.log("error" + error);
    }
})

module.exports = router;