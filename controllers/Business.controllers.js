const { Business } = require("../models/Business.model");

const { City } = require("../models/City.model");
const { Service } = require("../models/Services.model");
const { State } = require("../models/State.models");

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
    const business = new Business({
      phone,
      email,
      businessName,
      serviceOfBusiness,
      servicesInfo: createState._id,
    });
  await business.save();
    // If business not found, return an error
    if (!business) {
      return res.status(400).json({
        message: "Business not found!",
        status: false,
      });
    }

    const accessToken = await business.generatesAccessToken(business?._id);

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

// getBusinessInfo
exports.ownBusinessInfo = async (req, res) => {
  try {
    const { _id } = req.business;
    const business = await Business.findById(_id)
      .populate("servicesInfo")
      .exec();
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    // Find city by city ID from servicesInfo
    const cityId = business.servicesInfo?.city;
    const city = cityId ? await City.findById(cityId).exec() : null;

    // Find services by service ID from servicesInfo
    const servicesId = business.servicesInfo?._id;
    const services = servicesId
      ? await State.findById(servicesId).populate("city").exec()
      : null;

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
