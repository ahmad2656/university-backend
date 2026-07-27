const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const generateToken = require("../utils/generateToken");

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      role,
      full_name,
      roll_number,
      employee_id,
      department,
      semester,
      designation,
      phone,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = new User({ email, password, role });
    await user.save();

    if (role === "student") {
      await Student.create({
        user_id: user._id,
        full_name,
        roll_number,
        department,
        semester,
        phone: phone || null,
      });
    } else if (role === "teacher") {
      await Teacher.create({
        user_id: user._id,
        full_name,
        employee_id,
        department,
        designation: designation || "Lecturer",
        phone: phone || null,
      });
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
      email: user.email,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ user_id: user._id });
    } else if (user.role === "teacher") {
      profile = await Teacher.findOne({ user_id: user._id });
    }

    const token = generateToken({
      userId: user._id,
      role: user.role,
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await Student.findOne({ user_id: user._id });
    } else if (user.role === "teacher") {
      profile = await Teacher.findOne({ user_id: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        profile,
      },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { register, login, getMe };