const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  token: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 2 * 24 * 60 * 60 * 1000}, // Expire in 2 days
});

const RefreshTokenModel = model('RefreshToken', RefreshTokenSchema);

module.exports = RefreshTokenModel