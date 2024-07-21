const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BrainstormChatSchema = new Schema(
  {
    chatName: String,
    createdBy: { type: Schema.Types.ObjectID, ref: "User" },
    chatHistory: [{role: String, content: String}],
  },
  {
    timestamps: true,
  }
);

const BrainstormChatModel = model("BrainstormChat", BrainstormChatSchema);

module.exports = BrainstormChatModel;
