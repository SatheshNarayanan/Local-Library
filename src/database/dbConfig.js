const mongoose = require("mongoose")

mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology: true,
    useNewUrlParser: true
})

const db = mongoose.connection

db.on("error", (error) => {
    console.log(error)
})

db.once("open", () => {
    console.log("Mongo DB is Connected")
})