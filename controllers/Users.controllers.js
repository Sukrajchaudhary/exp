const { Users } = require("../models/Users.model");
exports.GetUsers = async (req, res) => {
  try {
    const user = await Users.find({
      _id: {
        $ne: req.user?._id,
      },
    }).select("-password -accessToken");
    if (!user) return null;
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
