const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Fee = require("../models/Fee");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("user_id", "email role");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("user_id", "email role");
    res.status(200).json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher_id", "full_name");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const { course_code, course_name, credit_hours, department, semester, teacher_id } = req.body;

    const existing = await Course.findOne({ course_code });
    if (existing) {
      return res.status(400).json({ success: false, message: "Course code already exists" });
    }

    const course = await Course.create({
      course_code, course_name, credit_hours,
      department, semester,
      teacher_id: teacher_id || null,
    });

    res.status(201).json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createFeeRecord = async (req, res) => {
  try {
    const { student_id, semester, total_amount, due_date } = req.body;

    const fee = await Fee.create({
      student_id, semester, total_amount,
      paid_amount: 0,
      due_date,
      status: "pending",
    });

    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getAllStudents,
  getAllTeachers,
  getCourses,
  createCourse,
  deleteUser,
  createFeeRecord,
};