const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      length: [20, "Username length must be less then 20 characters"],
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    profile: {
      type: String,
      require: true,
    },
    accessToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};
UserSchema.methods.generatesAccessToken = async function () {
  return jwt.sign({ id: this._id }, process.env.RefreshTokenSecret, {
    expiresIn: "2h",
  });
};
UserSchema.methods.generatesRefreshToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.RefreshTokenSecret,
    {
      expiresIn: "2h",
    }
  );
};
exports.Users = mongoose.model("Users", UserSchema);
