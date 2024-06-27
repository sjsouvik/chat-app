const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please enter the first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter the last name"],
    },
    username: {
      type: String,
      trim: true,
      required: [true, "Please enter username"],
      unique: [
        true,
        "This username is already present, please enter a unique username",
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "Please enter user's email id"],
      unique: [
        true,
        "This email is already registered, please enter a unique email id",
      ],
    },

    password: {
      type: String,
      required: [true, "Please enter the password to register"],
      select: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
