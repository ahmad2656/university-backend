const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Grade = require("../models/Grade");
const Fee = require("../models/Fee");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const path = require("path");

const getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const payFee = async (req, res) => {
  try {
    const { fee_id } = req.params;
    const { amount } = req.body;

    const fee = await Fee.findById(fee_id);
    if (!fee) {
      return res
        .status(404)
        .json({ success: false, message: "Fee record not found" });
    }

    fee.paid_amount += Number(amount);

    if (fee.paid_amount >= fee.total_amount) {
      fee.paid_amount = fee.total_amount;
      fee.status = "paid";
    } else if (new Date() > new Date(fee.due_date)) {
      fee.status = "overdue";
    } else {
      fee.status = "pending";
    }

    await fee.save();

    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { full_name, phone } = req.body;
    const updateData = { full_name, phone };
    if (req.file) {
      updateData.photo = req.file.path;
    }
    const student = await Student.findOneAndUpdate(
      { user_id: req.user.userId },
      updateData,
      { new: true },
    );
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const records = await Attendance.find({ student_id: student._id });
    const total = records.length;
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const leave = records.filter((r) => r.status === "leave").length;
    res.status(200).json({
      success: true,
      data: {
        total,
        present,
        absent,
        leave,
        percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAttendanceLog = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const records = await Attendance.find({ student_id: student._id })
      .populate("course_id", "course_name course_code")
      .sort({ date: -1 });
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const grades = await Grade.find({ student_id: student._id })
      .populate("course_id", "course_name course_code credit_hours")
      .sort({ semester: -1 });
    res.status(200).json({ success: true, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCGPATrend = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const grades = await Grade.find({ student_id: student._id });
    const semesterMap = {};
    grades.forEach((g) => {
      if (!semesterMap[g.semester]) semesterMap[g.semester] = [];
      semesterMap[g.semester].push(g.marks);
    });
    const trend = Object.keys(semesterMap)
      .sort((a, b) => a - b)
      .map((sem) => {
        const avg =
          semesterMap[sem].reduce((a, b) => a + b, 0) / semesterMap[sem].length;
        const cgpa = ((avg / 100) * 4).toFixed(2);
        return { semester: `Sem ${sem}`, cgpa: parseFloat(cgpa) };
      });
    res.status(200).json({ success: true, data: trend });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getFeeStatus = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const fees = await Fee.find({ student_id: student._id }).sort({
      semester: -1,
    });
    res.status(200).json({ success: true, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    const courses = await Course.find({
      department: student.department,
      semester: student.semester,
    }).populate("teacher_id", "full_name designation");
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssignments = async (req, res) => {
  try {
    const student = await Student.findOne({ user_id: req.user.userId });
    const courses = await Course.find({
      department: student.department,
      semester: student.semester,
    });
    const courseIds = courses.map((c) => c._id);
    const assignments = await Assignment.find({ course_id: { $in: courseIds } })
      .populate("course_id", "course_name course_code")
      .populate("teacher_id", "full_name")
      .sort({ due_date: 1 });

    const assignmentsWithStatus = assignments.map((a) => {
      const submission = a.submissions.find(
        (s) => s.student_id.toString() === student._id.toString(),
      );
      return {
        ...a.toObject(),
        mySubmission: submission || null,
      };
    });

    res.status(200).json({ success: true, data: assignmentsWithStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const submitAssignment = async (req, res) => {
  try {
    const { assignment_id } = req.params;
    const { message } = req.body;

    const student = await Student.findOne({ user_id: req.user.userId });
    const assignment = await Assignment.findById(assignment_id);

    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    const alreadySubmitted = assignment.submissions.find(
      (s) => s.student_id.toString() === student._id.toString(),
    );

    if (alreadySubmitted) {
      return res.status(400).json({
        success: false,
        message: "Already submitted",
        submission: alreadySubmitted,
      });
    }

    const now = new Date();
    const status = now > new Date(assignment.due_date) ? "late" : "submitted";

    const files = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const fileType = ext === ".pdf" ? "pdf" : "image";
        files.push({
          url: file.path.replace(/\\/g, "/"),
          type: fileType,
          name: file.originalname,
        });
      });
    }

    assignment.submissions.push({
      student_id: student._id,
      submitted_at: now,
      status,
      files,
      message: message || null,
    });

    await assignment.save();

    res.status(200).json({
      success: true,
      message:
        status === "late" ? "Submitted late!" : "Submitted successfully!",
      status,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAttendanceSummary,
  getAttendanceLog,
  getGrades,
  getCGPATrend,
  getFeeStatus,
  getCourses,
  getAssignments,
  payFee,
  submitAssignment,
};
