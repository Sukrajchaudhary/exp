const express = require("express");
const router = express.Router();
const { sendMessage,getMessage } = require("../controllers/Message.controllers");
const { verifyJWT } = require("../middleware/auth.middleware");
router.post("/sendmessage/:id", verifyJWT, sendMessage);
router.get("/getmessage/:id", verifyJWT, getMessage);
exports.router = router;
