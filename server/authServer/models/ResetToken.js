const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ResetTokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ResetTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 }); // Expires in 30 min

const ResetTokenModel = model("ResetToken", ResetTokenSchema);

module.exports = ResetTokenModel;
