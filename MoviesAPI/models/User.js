const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema for the user model and define its properties
const UserSchema = new Schema({
  name: {
    type : String,
    required : true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password:{
    type :String ,
    required :true,
    minlength: 6,
  },
  watchList: [
    {
      movie: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'movie'
      },
      watchState: {
        type: String,
        enum: ["notWatched", 'wantToWatch', 'doNotWantToWatch', 'willWatch', 'watching'],
        default: 'notWatched',
      }
    }
  ],
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {timestamps: true});

module.exports=User=mongoose.model("user",UserSchema);
