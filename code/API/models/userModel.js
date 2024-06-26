const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "The email address is not valid"],
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    default: "patient",
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minLength: [8, "A user's password must be at least 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "A user must have a confirmed password"],
    validate: {
      // Only works on create and save
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
  // delete password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this is a query middleware, this keyword points to current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
