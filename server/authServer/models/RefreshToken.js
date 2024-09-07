const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RefreshTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 172800 }); // Expires in 1 hour

const RefreshTokenModel = model("RefreshToken", RefreshTokenSchema);

module.exports = RefreshTokenModel;
