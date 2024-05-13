const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/auth.middleware");
const { CheckUser } = require("../controllers/Auth.controllers");
const { GetUsers } = require("../controllers/Users.controllers");
router.get("/checkuser", verifyJWT, CheckUser);
router.get("/getusers", verifyJWT, GetUsers);

exports.router = router;
