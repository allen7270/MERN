const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// instance method
userSchema.methods.isStudent = function () {
  return this.role == "student";
};

userSchema.methods.isInstroctor = function () {
  return this.role == "instructor";
};

userSchema.methods.comparePassword = async function (password, cb) {
  let result = await bcrypt.compare(password, this.password);
  return cb(null, result);
};

// mongoose middlewares
// 若 新用戶/更改密碼, 進行雜湊
userSchema.pre("save", async function (next) {
  // this -> mongoDB 內的 document
  if (this.isNew || this.isModified("password")) {
    // bcrypt
    const hashValue = await bcrypt.hash(this.password, 10);
    this.password = hashValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
