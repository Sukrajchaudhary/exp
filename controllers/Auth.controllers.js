const { Users } = require("../models/Users.model");
const { uploadOnCloudinary } = require("../utils/Cloudinary");

//generationg accessToken and refreshToken
const generatesToken = async (userId) => {
  try {
    const user = await Users.findById(userId);
    if (!user) {
      throw new Error("User Not Found");
    }
    const accessToken = await user.generatesAccessToken(userId);
    const refreshToken = await user.generatesRefreshToken(userId);
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error.message);
  }
};
// create Users
exports.createUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const profilePath = req.files?.profile[0].path;
    if (
      [email, password, username].some(
        (fields) => !fields || fields.trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const isExistEmail = await Users.findOne({ email });
    if (isExistEmail) {
      return res
        .status(400)
        .json({ message: "User with these email Already Exist !" });
    }
    const profile = await uploadOnCloudinary(profilePath);
    const user = new Users({
      email: email,
      username: username,
      password: password,
      profile: profile.url || "",
    });
    await user.save();
    return res.status(201).json({
      success: true,
      message: "Signup SuccessFully!",
      info: user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if ([email, password].some((fields) => !fields || fields.trim() === "")) {
      return res.status(400).json({
        message: "All fields are Required !",
      });
    }
    const isExistUser = await Users.findOne({ email });
    if (!isExistUser) {
      return res
        .status(400)
        .json({ message: "User With thes email Not Exist !!" });
    }
    const isCorrectPassword = await isExistUser.comparePassword(password);
    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Invalid Credentials !",
      });
    }
    const { accessToken, refreshToken } = await generatesToken(isExistUser._id);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Login SuccessFully",
        success: true,
        user: isExistUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
// check user
exports.CheckUser = async (req, res) => {
  return res.status(200).json(req.user);
};
// logout
exports.logoutUsers = async (req, res) => {
  try {
    await Users.findByIdAndUpdate(
      req.user?.id,
      { $set: { refreshToken: undefined } },
      { new: true }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
  return  res
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "user logout SuccessFully",
      });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


