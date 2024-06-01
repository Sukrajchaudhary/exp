const {Business}=require("../models/Business.model")
const jwt = require("jsonwebtoken");
exports.verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new Error("Token Not Found");
    }
    const decodedToken = jwt.verify(token, process.env.RefreshTokenSecret);
    const business = await Business.findById(decodedToken?.id).select('-OTP -OTPExp');
    if (!business) {
      return res.status(401).json({
        message: "Invalid Access Token",
      });
    }
    req.business = business;
    next();
  } catch (error) {
    return res.status(401).json(error.message);
  }
};
