const { OTPModel } = require("../models/Otp.model");
const otpGenerator = require("otp-generator");
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = new twilio(accountSid, authToken);
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

    let business = await OTPModel.findOne({ phone });
    if (business) {
      business.OTP = OTP;
      business.OTPExp = OTPExp;
      await business.save();
    } else {
      const newBusiness = new OTPModel({ phone, OTP, OTPExp });
      await newBusiness.save();
    }

    // Send OTP via Twilio
    await client.messages.create({
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
    if (!otp) {
      return res.status(400).json({ message: "Please Enter OTP" });
    }
    const business = await OTPModel.findOne({ OTP: otp });
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
