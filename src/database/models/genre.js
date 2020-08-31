const mongoose = require("mongoose")

const { Schema, model } = mongoose

const GenreSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        enum: ['Fiction', 'Non-Fiction', 'Romance', 'Military History','Comedy','Horror','Action-Adventure'], 
        minlength: 3,
        maxlength: 100
    }
}, {
    toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  })

GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model("Genre",GenreSchema)
