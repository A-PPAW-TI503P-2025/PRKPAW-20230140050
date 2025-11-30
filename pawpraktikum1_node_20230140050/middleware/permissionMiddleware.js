const jwt = require("jsonwebtoken");

// PERBAIKAN: Ambil secret dari environment variable (file .env)
// Ini agar konsisten dengan authController.js
const JWT_SECRET = process.env.JWT_SECRET;

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // Format header biasanya: "Bearer <token>"
  // Kita ambil bagian token-nya saja (index 1)
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak disediakan." });
  }

  // Verifikasi Token
  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); // Tambahan log error
      return res
        .status(403)
        .json({ message: "Token tidak valid atau kedaluwarsa." });
    }

    // Token valid! Simpan data user (id, nama, role) ke request
    // agar bisa dipakai di controller (CheckIn/CheckOut)
    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  // Cek apakah data user dari token memiliki role 'admin'
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ message: "Akses ditolak. Hanya untuk admin." });
  }
};
