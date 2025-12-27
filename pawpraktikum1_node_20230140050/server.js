require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path"); // <--- 1. TAMBAHKAN IMPORT INI
const app = express();
const PORT = process.env.PORT || 3001;
const morgan = require("morgan");

// Impor router
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require("./routes/auth");
const ruteBuku = require("./routes/books");
const iotRoutes = require("./routes/iot");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// --- 2. KONFIGURASI FOLDER STATIC (WAJIB UNTUK MODUL 10) ---
// Ini agar URL gambar (http://localhost:3001/uploads/foto.jpg) bisa dibuka
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ------------------------------------------------------------

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", presensiRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/books", ruteBuku);
app.use("/api/iot", iotRoutes);

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
