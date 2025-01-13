/**
 * Module dependencies.
 */
const mongoose = require('mongoose')

/**
 * Schema definition 
 */
const MovieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    default: 0
  },
  reviews: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'user'
        },
        comment: String,
        rate: Number
      }
    ],
    default: []
  }
}, {
  timestamps: true
})

MovieSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {  
      delete ret._id
    }
})


module.exports=User=mongoose.model("movie",MovieSchema);