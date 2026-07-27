const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getAllStudents,
  getAllTeachers,
  createCourse,
  getCourses,
  deleteUser,
  createFeeRecord,
} = require("../controllers/adminController");
const { isAdmin } = require("../middleware/roleMiddleware");

router.use(isAdmin);

router.get("/users", getAllUsers);
router.get("/students", getAllStudents);
router.get("/teachers", getAllTeachers);
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.delete("/users/:id", deleteUser);
router.post("/fee", createFeeRecord);

module.exports = router;