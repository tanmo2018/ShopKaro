require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("./db/conn");
const DefaultData = require("./defaultdata");
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");


app.use(express.json());
app.use(cookieParser(""));
// app.use(cors({ origin: 'https://shopkaroindia.onrender.com', credentials: true })); //gives permission to the cors to give credential
// //cross platform is only frontend
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //gives permission to the cors to give credential
//cross platform is only frontend
// app.use(cors());
app.use(router);

const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

DefaultData();