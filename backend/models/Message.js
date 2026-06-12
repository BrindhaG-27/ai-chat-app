const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: String,
    sender: String, // later you can replace with userId
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);