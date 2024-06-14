const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserInfoSchema = new Schema({
  user_id: { type: Schema.Types.ObjectID, ref: "User" },
  email: { type: String, ref: "User.email" },
  name: String,
  profilePicture: String,
  bio: String,
  experience: String,
  favoriteBooks: [String],
  favoriteAuthors: [String],
  favoriteGenre: String,
  goals: [String],
  socialMediaLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    pinterest: String,
    twitter: String,
  },
});



const UserInfoModel = model("UserInfo", UserInfoSchema);

module.exports = UserInfoModel;