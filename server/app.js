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
//gives permission to the cors server(frontend) to fetch data
app.use(cors({ origin: 'https://shopkaroindia.onrender.com', credentials: true }));
// app.use(cors({ origin: 'http://localhost:3000', credentials: true })); //local
app.use(router);

const port = process.env.PORT || 8005;

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

DefaultData();