const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/auth.middleware");
const { upload } = require("../middleware/multer.middleware");
const {
  createUser,
  loginUser,
  CheckUser,
  logoutUsers
} = require("../controllers/Auth.controllers");

router
  .post(
    "/signup",
    upload.fields([
      {
        name: "profile",
        maxCount: 1,
      },
    ]),
    createUser
  )
  .post("/login", loginUser)
  .get("/checkuser", verifyJWT, CheckUser)
  .post("/logout",verifyJWT,logoutUsers)

exports.router = router;
