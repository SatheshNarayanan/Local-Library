const path = require('path');
require("dotenv").config({
    path: path.join(__dirname, "../.env")
  })
  require("./database/dbConfig")
const express = require('express');
const expressHBS = require("express-handlebars");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog')
const { ifEquality , ifNotEquality}  = require("./views/helpers/ifEquality")
const app = express();

const hbs = expressHBS.create({
    extname : ".hbs",
    layoutsDir : path.join(__dirname,"./views/layouts"),
    partialsDir : path.join(__dirname, "./views/partials"),
    helpers: {
        ifEquality,
        ifNotEquality
      }
})

app.engine(".hbs",hbs.engine);
app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "./views"))

app.use(express.static(path.join(__dirname,'../public')))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

app.get("/",(req,res) => {
    res.status(200).render("homes.hbs", {
        layout: "main.hbs",
        title: "Home",
      });
})

app.listen( process.env.PORT || 3000, () => {
    console.log("Im still running..!!")
})



