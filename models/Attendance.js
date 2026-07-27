const { Schema, model } = require("mongoose");

const attendanceSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "leave"],
      required: true,
    },
    marked_by: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
  },
  { timestamps: true }
);

const Attendance = model("Attendance", attendanceSchema);
module.exports = Attendance;