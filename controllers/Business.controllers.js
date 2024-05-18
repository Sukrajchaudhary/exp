const { Business } = require("../models/Business.model");
// TOD0: send OTP for veryfying phone number
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
//Regestring Business.
exports.RegisterBusiness = async (req, res) => {
  try {
    const { email, phone, businessName, serviceCategory, state, city } =
      req.body;

    if (
      [email, phone, businessName, serviceCategory, state, city].some(
        (fields) => !fields || fields.trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedBusinessName = businessName.trim();
    const existingBusiness = await Business.findOne({
      $or: [{ businessName: trimmedBusinessName }, { email: trimmedEmail }],
    });
    if (existingBusiness) {
      return res.status(400).json({
        message: "Sorry, this business name or email is already registered.",
      });
    }
    const newBusiness = new Business({
      email,
      phone,
      businessName,
      serviceCategory,
      state,
      city,
    });

    await newBusiness.save();

    return res
      .status(201)
      .json({ message: "Business registered successfully!", newBusiness });
  } catch (error) {
    console.error("Error registering business:", error);
    return res.status(500).json({ message: "Server error" });
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
