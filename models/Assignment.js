const { Schema, model } = require("mongoose");

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    course_id: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    teacher_id: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
    due_date: { type: Date, required: true },
    total_marks: { type: Number, default: 100 },
    submissions: [
      {
        student_id: { type: Schema.Types.ObjectId, ref: "Student" },
        submitted_at: { type: Date, default: Date.now },
        status: { type: String, enum: ["submitted", "late"], default: "submitted" },
        files: [
          {
            url: { type: String },
            type: { type: String, enum: ["pdf", "image"] },
            name: { type: String },
          },
        ],
        message: { type: String, default: null },
        marks_obtained: { type: Number, default: null },
      },
    ],
  },
  { timestamps: true }
);

const Assignment = model("Assignment", assignmentSchema);
module.exports = Assignment;