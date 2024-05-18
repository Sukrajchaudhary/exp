const express = require("express");
const router = express.Router();
const {
  RegisterBusiness,
  GetsAllRegisteredBusiness,
  updateBusinessInfro,
  findBusiness,
  getStatesCitiesServices,
} = require("../controllers/Business.controllers");
router
  .post("/register", RegisterBusiness)
  .get("/allbusiness", GetsAllRegisteredBusiness)
  .patch("/updateinfo/:_id", updateBusinessInfro)
  .get("/getservice", findBusiness)
  .get("/getStatesCitiesServices", getStatesCitiesServices);
exports.router = router;
