const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/studentController");
const { isStudent } = require("../middleware/roleMiddleware");
const uploadProfilePhoto = require("../middleware/uploadProfilePhoto");
const uploadAssignment = require("../middleware/uploadAssignment");

router.use(isStudent);

router.get("/profile", getProfile);

router.put("/profile", uploadProfilePhoto.single("photo"), updateProfile);

router.get("/attendance/summary", getAttendanceSummary);

router.get("/attendance/log", getAttendanceLog);

router.get("/grades", getGrades);

router.get("/cgpa", getCGPATrend);

router.get("/fee", getFeeStatus);

router.get("/courses", getCourses);

router.patch("/fee/:fee_id/pay", payFee);

router.get("/assignments", getAssignments);
router.post(
  "/assignments/:assignment_id/submit",
  uploadAssignment.array("files", 2),
  submitAssignment,
);

module.exports = router;
