const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20
  },
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 20
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    maxlength: 100
  },
  avatar: String
});

User.virtual("id").get(function() {
  return this._id.toHexString
  }
)
User.set("toJSON", {virtuals: true});

/**
 * Get user profile data.
 */
User.methods.getData = function(){
  return {
      id: this._id,
      name: this.name,
      username: this.username,
      about: this.about,
      avatar: this.avatar
  };
};

/**
 * Generate user token with profile data.
 */
User.methods.signJwt = function(){
  let data = this.getData();
  data.token = jwt.sign(data, process.env.JWT_SECRET);
  return data;
};

User.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

/**
 * Pre save middleware (before save user document).
 * @param next
 */
User.pre('save', function(next) {
  if(this.isNew || this.isModified('password')){
      this.password = bcrypt.hashSync(this.password, 8);
  }
  next();
});

module.exports = mongoose.model("User", User)