const mongoose = require("mongoose")

const { Schema, model } = mongoose

const BookSchema = new Schema({
    title : {
        type : String,
        required : true,
        maxlength : 100,
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "Author",
        required : true
    },
    summary : {
        type : String,
        required : true
    },
    isbn : {
        type : String,
        required : true
    },
    genre : [{
        type : Schema.Types.ObjectId,
        ref : "Genre"
    }]
}, {
    toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  });

  BookSchema.virtual("url").get(function() {
    return '/catalog/book/'+this._id
  })

module.exports = mongoose.model("Book",BookSchema)