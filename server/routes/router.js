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

//get products data 
router.get("/getproducts", async (req, res) => {
    try {
        const productdata = await Products.find();

        res.status(201).json(productdata);
    } catch {
        console.log("error" + error.message);
    }
});

//get individual product data
router.get("/getproductsone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const individualdata = await Products.findOne({ id: id });
        res.status(201).json(individualdata);
    }
    catch (error) {
        console.log("error" + error.message);
    }
});

//register user
router.post("/register", async (req, res) => {
    const { fname, email, mobile, password, cpassword } = req.body;

    try {
        if (!fname || !email || !mobile || !password || !cpassword) {
            res.status(422).json({ error: "Fill the all fields!" });
            console.log("Empty field!")
        } else {
            const preUser = await USER.findOne({ email: email });

            if (preUser) {
                res.status(422).json({ error: "This mail is already registered!" });
            } else if (password != cpassword) {
                res.status(422).json({ error: "Password and confirm password are not same." });
            } else {
                const finalUser = new USER({
                    fname, email, mobile, password, cpassword
                });
                const storeData = await finalUser.save();
                res.status(201).json(storeData);
            }
        }

    } catch (error) {
        res.status(401).json(error.message);
    }
})

//login user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(400).json({ error: "Fill the all fields!" });
        } else {
            const userLogin = await USER.findOne({ email: email });

            if (userLogin) {
                const isMatch = await bcrypt.compare(password, userLogin.password);

                if (!isMatch) {
                    res.status(400).json({ error: "Invalid password" });
                } else {
                    //generate token
                    const token = await userLogin.generateAuthtoken();
                    //great learning -> in react you have to add 'credential includes' to send cookie data
                    res.cookie("ShopKaro", token, {
                        expires: new Date(Date.now() + 2592000000),
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

//add to cart
router.post("/addcart/:id", authenticate, async (req, res) => {
    try {
        const { id } = req.params; //product id

        const cart = await Products.findOne({ id: id });

        const UserContact = await USER.findOne({ _id: req.userID });

        if (UserContact) {
            const cartData = await UserContact.addcartdata(cart);
            await UserContact.save();
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
        const { id } = req.params; //product id

        req.rootUser.carts = req.rootUser.carts.filter((curval) => {
            return curval.id != id;
        })

        req.rootUser.save();
        res.status(201).json(req.rootUser);
        console.log("Item is removed");
    } catch (error) {
        res.status(400).json(req.rootUser);
        console.log("error" + error);
    }
})

//User logout
router.get("/logout", authenticate, (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curtoken) => {
            return curtoken.token != req.token;
        });

        res.clearCookie("ShopKaro", { path: "/" });

        req.rootUser.save();
        res.status(201).json(req.rootUser.tokens);
        console.log("User is logged out");
    } catch (error) {
        console.log("error in user logout! ");
    }
})

//order creation for payment
router.post("/create/orderId", authenticate, (req, res) => {
    try {
        var options = {
            amount: req.body.amount,  // amount in 'paisa'
            currency: "INR",
            receipt: "rcp1"
        };
        instance.orders.create(options, function (err, order) {
            res.status(201).json({ orderId: order.id });
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
        console.log("All items are removed.");
    } catch (error) {
        res.status(400).json(req.rootUser);
        console.log("error" + error);
    }
})

module.exports = router;