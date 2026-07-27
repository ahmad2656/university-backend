const Teacher = require("../models/Teacher");
const Course = require("../models/Course");
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");
const Grade = require("../models/Grade");
const Assignment = require("../models/Assignment");

const getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user_id: req.user.userId });
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }
    res.status(200).json({ success: true, data: teacher });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyCourses = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user_id: req.user.userId });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found. Please complete registration.",
      });
    }

    const courses = await Course.find({ teacher_id: teacher._id });
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { course_id, date, records } = req.body;

    if (!course_id || !date || !records || !Array.isArray(records)) {
      return res.status(400).json({
        success: false,
        message: "course_id, date aur records required hai",
      });
    }

    const teacher = await Teacher.findOne({ user_id: req.user.userId });
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const attendanceRecords = records.map((r) => ({
      student_id: r.student_id,
      course_id,
      date: new Date(date),
      status: r.status,
      marked_by: teacher._id,
    }));

    await Attendance.insertMany(attendanceRecords);

    res
      .status(201)
      .json({ success: true, message: "Attendance marked successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addGrade = async (req, res) => {
  try {
    const { student_id, course_id, semester, marks } = req.body;

    const existing = await Grade.findOne({ student_id, course_id, semester });
    if (existing) {
      existing.marks = marks;
      await existing.save();
      return res.status(200).json({ success: true, data: existing });
    }

    const grade = await Grade.create({
      student_id,
      course_id,
      semester,
      marks,
    });
    res.status(201).json({ success: true, data: grade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getStudentsByCourse = async (req, res) => {
  try {
    const { course_id } = req.params;
    const course = await Course.findById(course_id);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const students = await Student.find({
      department: course.department,
      semester: course.semester,
    });

    const studentsWithCGPA = await Promise.all(
      students.map(async (student) => {
        const grades = await Grade.find({ student_id: student._id });

        let cgpa = 0;
        if (grades.length > 0) {
          const avgMarks =
            grades.reduce((a, b) => a + b.marks, 0) / grades.length;
          cgpa = parseFloat(((avgMarks / 100) * 4).toFixed(2));
        }

        return {
          ...student.toObject(),
          cgpa,
        };
      }),
    );

    res.status(200).json({ success: true, data: studentsWithCGPA });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const createAssignment = async (req, res) => {
  try {
    const { title, description, course_id, due_date, total_marks } = req.body;
    const teacher = await Teacher.findOne({ user_id: req.user.userId });

    const assignment = await Assignment.create({
      title,
      description,
      course_id,
      teacher_id: teacher._id,
      due_date,
      total_marks: total_marks || 100,
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTeacherAssignments = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ user_id: req.user.userId });
    const assignments = await Assignment.find({ teacher_id: teacher._id })
      .populate("course_id", "course_name course_code")
      .populate("submissions.student_id", "full_name roll_number");
    res.status(200).json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProfile,
  getMyCourses,
  markAttendance,
  addGrade,
  getStudentsByCourse,
  createAssignment,
  getTeacherAssignments,
};
