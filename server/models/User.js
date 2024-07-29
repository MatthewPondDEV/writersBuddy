const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, min: 4, required: false }, // Make password optional for OAuth users
  googleId: { type: String, required: false }, // Add this field for Google OAuth
});

// Make sure to add other relevant fields if necessary, such as profile information

const UserModel = model("User", UserSchema);

module.exports = UserModel;
