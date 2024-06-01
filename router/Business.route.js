const express = require("express");
const router = express.Router();
const {
  RegisterBusiness,
  GetsAllRegisteredBusiness,
  updateBusinessInfro,
  findBusiness,
  getStatesCitiesServices,
  sendOTP,
  verifyOTP,
  ownBusinessInfo,
} = require("../controllers/Business.controllers");
const {verifyJWT}=require("../middleware/auth.middleware")
router
  .post("/register", RegisterBusiness)
  .get("/allbusiness", GetsAllRegisteredBusiness)
  .patch("/updateinfo/:_id", updateBusinessInfro)
  .get("/getservice", findBusiness)
  .get("/getStatesCitiesServices", getStatesCitiesServices)
  .post("/sendOTP", sendOTP)
  .post("/verifyOtp", verifyOTP)
  .get("/info",verifyJWT , ownBusinessInfo);
exports.router = router;
