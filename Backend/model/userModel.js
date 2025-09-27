const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
  verifyOTP: {
    type: String,  
    default: '',
  },
  verifyOTPExpireAT: {
    type: Number,
    default: 0,
  },
  isAccountVerify: {
    type: Boolean,
    default: false,
  },
  ResetOTP: {
    type: String,
    default: '',
  },
  ResetOTPExpireAt: {
    type: Number,
    default: 0,
  },
});




const userModel = mongoose.model("User", userSchema);


module.exports =  userModel ;
