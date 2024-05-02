const mongoose = require('mongoose')
const {Schema, model} = mongoose;

const NoteSchema = new Schema(
  {
    title: String,
    createdBy: { type: Schema.Types.ObjectID, ref: "User" },
    content: String,
  },
  {
    timestamps: true,
  }
);

const NoteModel = model('Note', NoteSchema)

module.exports = NoteModel