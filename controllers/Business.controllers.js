const { Business } = require("../models/Business.model");
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const { City } = require("../models/City.model");
const { Service } = require("../models/Services.model");
const { State } = require("../models/State.models");


const accountSid = process.env.Account_SID;
const authToken = process.env.TWILO_Auth_Token;

const twiloClient = new twilio(accountSid, authToken);

//Regestring Business.
exports.RegisterBusiness = async (req, res) => {
  try {
    const {
      phone,
      email,
      businessName,
      serviceOfBusiness,
      city,
      state,
      serviceCategory,
    } = req.body;

    // Create and save service
    const service = new Service({
      service: serviceCategory,
    });
    await service.save();

    // Create and save city
    const createCity = new City({
      city: city,
      services: service._id,
    });
    await createCity.save();

    // Create and save state
    const createState = new State({
      state: state,
      city: createCity._id,
    });
    await createState.save();

    // Find and update existing business
    const business = await Business.findOneAndUpdate(
      { phone },
      {
        email,
        businessName,
        serviceOfBusiness,
        servicesInfo: createState._id,
      },
      { new: true }
    );

    // If business not found, return an error
    if (!business) {
      return res.status(400).json({
        message: "Business not found!",
        status: false,
      });
    }

    const accessToken = await user.generatesAccessToken(business?._id);

    return res.status(200).json({
      message: "Business Registered Successfully!",
      status: true,
      business: business,
      token: accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// Otp sends
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ message: "Phone number is required!" });
    }

    // Generate OTP
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const OTPExp = new Date(Date.now() + 10 * 60000);

    let business = await Business.findOne({ phone });
    if (business) {
      business.OTP = OTP;
      business.OTPExp = OTPExp;
      await business.save();
    } else {
      const newBusiness = new Business({ phone, OTP, OTPExp });
      await newBusiness.save();
    }

    // Send OTP via Twilio
    await twiloClient.messages.create({
      body: `Your verification code is: ${OTP}`,
      to: phone,
      from: process.env.Twillo_Phone, 
    });

    return res.status(200).json({
      OTP: OTP,
      message: "Code sent successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// verifyotp
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log("otp", otp);
    if (!otp) {
      return res.status(400).json({ message: "Please Enter OTP" });
    }
    const business = await Business.findOne({ OTP: otp });
    if (!business) {
      return res.status(400).json({ message: "Please Enter correct OTP" });
    }
    return res
      .status(200)
      .json({ message: "Verification Successful", status: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
// getBusinessInfo
exports.ownBusinessInfo = async (req, res) => {
  try {
    const { _id } = req.business;
    const business = await Business.findById(_id).populate('servicesInfo').exec();
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    console.log(business.servicesInfo);

    // Find city by city ID from servicesInfo
    const cityId = business.servicesInfo?.city;
    const city = cityId ? await City.findById(cityId).exec() : null;

    // Find services by service ID from servicesInfo
    const servicesId = business.servicesInfo?._id;
    const services = servicesId ? await State.findById(servicesId).populate('city').exec() : null;

    return res.status(200).json({
      business,
      city,
      services,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get all Registered Business.
exports.GetsAllRegisteredBusiness = async (req, res) => {
  try {
    const allBusiness = await Business.find();
    if (!allBusiness) {
      return res.status(204).json({ message: "No Business Registered yet" });
    }
    return res.status(200).json(allBusiness);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
//update business
exports.updateBusinessInfro = async (req, res) => {
  try {
    const { _id } = req.params;
    const business = await Business.findById(_id);
    if (!business) {
      return res.status(400).json({ message: "Not found Business" });
    }
    const updateBusiness = await Business.findByIdAndUpdate(
      { _id },
      { ...req.body },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Updated SuccessFully", updateBusiness });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//filtering business
exports.findBusiness = async (req, res) => {
  try {
    const { state, city, serviceCategory } = req.query;
    let query = {};
    if (state) {
      query.state = state.trim();
    }
    if (city) {
      query.city = city.trim();
    }
    if (serviceCategory) {
      query.serviceCategory = serviceCategory.trim();
    }
    const businesses = await Business.find(query);
    if (businesses.length === 0) {
      return res.status(400).json({ message: "Not Found" });
    }

    return res.status(200).json({ businesses });
  } catch (error) {
    console.error("Error searching businesses:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
//getStatesCitiesServices
exports.getStatesCitiesServices = async (_, res) => {
  try {
    const states = await Business.distinct("state");
    const cities = await Business.distinct("city");
    const services = await Business.distinct("serviceCategory");

    const result = {
      city: cities.map((city) => ({ city })),
      state: states.map((state) => ({ state })),
      service: services.map((service) => ({ service })),
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error(
      "Error fetching distinct states, cities, and services:",
      error
    );
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
