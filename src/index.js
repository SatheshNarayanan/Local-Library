const path = require('path');
require("dotenv").config({
    path: path.join(__dirname, "../.env")
  })
const express = require('express');
const cookieParser = require('cookie-parser');


const app = express();

app.get("/",(req,res) => {
    res.status(200).send("Welocme to our Library")
})

app.listen( process.env.PORT || 3000, () => {
    console.log("Im still running..!!")
})