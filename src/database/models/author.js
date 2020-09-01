const mongoose = require("mongoose")
const moment = require('moment');


const { Schema, model } = mongoose

const AuthorSchema = new Schema({
    first_name : { type : String, required : true, maxlength : 100 },
    last_name : { type : String, required : true, maxlength : 100 },
    date_of_birth : { type : Date},
    date_of_death : { type : Date}
}, {
    toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  })

  AuthorSchema
  .virtual('name')
  .get(function () {
    return  this.first_name + ' ' + this.last_name
  });

  AuthorSchema
  .virtual("lifespan")
  .get(function() {
      if( !this.date_of_death)
      {
        this.date_of_death = Date.now()
      }
      if( !this.date_of_birth)
      {
        this.date_of_birth = Date.now()
      }
      return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString()
  })

  AuthorSchema
  .virtual("url")
  .get(function() {
      return "/catalog/author/" + this._id  
  })

  AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function () {
    return moment(this.date_of_birth).format('MMMM Do, YYYY');
  });

  AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function () {
    return moment(this.date_of_death).format('MMMM Do, YYYY');
  });

  module.exports = mongoose.model("Author",AuthorSchema)