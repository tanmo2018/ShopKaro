const express = require("express");
const router = express.Router();
const Products = require("../models/productsSchema");
const USER = require("../models/userSchema");

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
        res.status(400).json(individualdata);
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

module.exports = router;