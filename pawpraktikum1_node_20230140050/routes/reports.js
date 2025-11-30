const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
// Pastikan path middleware benar
const {
  authenticateToken,
  isAdmin,
} = require("../middleware/permissionMiddleware");

// Rute Laporan Harian (GET /api/reports/daily)
// Baris ini yang kemungkinan error sebelumnya karena 'isAdmin' atau 'getDailyReport' tidak terbaca
router.get(
  "/daily",
  authenticateToken,
  isAdmin,
  reportController.getDailyReport
);

module.exports = router;
