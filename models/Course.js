const { Schema, model } = require("mongoose");

const courseSchema = new Schema(
  {
    course_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    course_name: {
      type: String,
      required: true,
      trim: true,
    },
    credit_hours: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },
    department: {
      type: String,
      required: true,
      enum: ["Computer Science", "Business", "Engineering", "Medicine", "Arts", "Law"],
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
  },
  { timestamps: true }
);

const Course = model("Course", courseSchema);
module.exports = Course;