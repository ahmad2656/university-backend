const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./config/db");
const verifyToken = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://university-frontend-nu.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/student", verifyToken, studentRoutes);
app.use("/api/teacher", verifyToken, teacherRoutes);
app.use("/api/admin", verifyToken, adminRoutes);
app.use("/api/ai", verifyToken, aiRoutes);

app.get("/", (req, res) => {
  res.json({ message: "University Portal API Running" });
});

app.use((err, req, res, next) => {
  console.log("=== ERROR CAUGHT ===");
  console.log("Name:", err?.name);
  console.log("Message:", err?.message);
  console.log("Stack:", err?.stack);
  console.log("Full:", err);
  console.log("====================");
  res.status(500).json({
    success: false,
    message: err?.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
