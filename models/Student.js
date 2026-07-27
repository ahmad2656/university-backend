const { Schema, model } = require("mongoose");

const studentSchema = new Schema(
  
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
    roll_number: {
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
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    cgpa: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 4.0,
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

const Student = model("Student", studentSchema);
module.exports = Student;