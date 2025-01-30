const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
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
    },
  },
  {
    Timestamp: true,
  }
);

// here "user" is a type of table or collection
const User = mongoose.model("user", UserSchema);

module.exports = User;
