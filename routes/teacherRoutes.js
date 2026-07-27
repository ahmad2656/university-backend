const express = require("express");
const router = express.Router();
const {
  getProfile,
  getMyCourses,
  markAttendance,
  addGrade,
  getStudentsByCourse,
  createAssignment,
  getTeacherAssignments,
} = require("../controllers/teacherController");
const { isTeacher } = require("../middleware/roleMiddleware");

router.use(isTeacher);

router.get("/profile", getProfile);
router.get("/courses", getMyCourses);
router.get("/courses/:course_id/students", getStudentsByCourse);
router.post("/attendance", markAttendance);
router.post("/grades", addGrade);
router.post("/assignments", createAssignment);
router.get("/assignments", getTeacherAssignments);

module.exports = router;