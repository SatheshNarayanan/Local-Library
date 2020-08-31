const path = require('path');
require("dotenv").config({
    path: path.join(__dirname, "../.env")
  })
  require("./database/dbConfig")
const express = require('express');
const expressHBS = require("express-handlebars");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express();

const hbs = expressHBS.create({
    extname : ".hbs",
    layoutsDir : path.join(__dirname,"./views/layouts"),
    partialsDir : path.join(__dirname, "./views/partials") 
})

app.engine(".hbs",hbs.engine);
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "./views"))

app.use(express.static(path.join(__dirname,'../public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))

app.get("/",(req,res) => {
    res.status(200).send("Welocme to our Library")
})

app.listen( process.env.PORT || 3000, () => {
    console.log("Im still running..!!")
})