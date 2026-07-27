const { Schema, model } = require("mongoose");

const feeSchema = new Schema(
  {
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    semester: {
      type: Number,
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
    },
    paid_amount: {
      type: Number,
      default: 0,
    },
    due_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Fee = model("Fee", feeSchema);
module.exports = Fee;