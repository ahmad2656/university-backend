const { Schema, model } = require("mongoose");

const teacherSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    employee_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      enum: ["Computer Science", "Business", "Engineering", "Medicine", "Arts", "Law"],
    },
    designation: {
      type: String,
      enum: ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"],
      default: "Lecturer",
    },
    photo: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Teacher = model("Teacher", teacherSchema);
module.exports = Teacher;