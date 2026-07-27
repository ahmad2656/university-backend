const { Schema, model } = require("mongoose");

const gradeSchema = new Schema(
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
    semester: {
      type: Number,
      required: true,
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade_letter: {
      type: String,
      enum: ["A+", "A", "B+", "B", "C+", "C", "D", "F"],
      default: null,
    },
  },
  { timestamps: true },
);

gradeSchema.pre("save", function () {
  const m = this.marks;
  if (m >= 90) this.grade_letter = "A+";
  else if (m >= 85) this.grade_letter = "A";
  else if (m >= 80) this.grade_letter = "B+";
  else if (m >= 75) this.grade_letter = "B";
  else if (m >= 70) this.grade_letter = "C+";
  else if (m >= 65) this.grade_letter = "C";
  else if (m >= 60) this.grade_letter = "D";
  else this.grade_letter = "F";
});

const Grade = model("Grade", gradeSchema);
module.exports = Grade;
