const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  personalInformation : {
    name : String,
    DOB : Date,
    birthPlace: String,
    currentCity: String,
    profession : String
  },
  contactDetails : {
    email : String,  //unique
    phone : String   //unique
  },
  loginDetails : {
    hash: String,
    salt: String,
  },
  hobbies : [],
  Bio : String,
  profileImageURL : String,
  coverImageURL : String,
  userProfileURL: String,
  followers : [],
  following : [],
  community : [],
  interests: [],
  
});

const User = mongoose.model("user", userSchema);

module.exports = User;