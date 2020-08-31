const mongoose = require("mongoose")

const { Schema, model } = mongoose

const BookInstanceSchema = new Schema({
    book: { 
        type: Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    imprint: {
        type: String, 
        required: true
    },
    status: {
        type: String, 
        required: true, 
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], 
        default: 'Maintenance'
    },
    due_back: {
        type: Date, 
        default: Date.now
    }
}, {
    toObject: {
    virtuals: true
    },
    toJSON: {
    virtuals: true 
    }
  })


BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

module.exports = mongoose.model('BookInstance', BookInstanceSchema);