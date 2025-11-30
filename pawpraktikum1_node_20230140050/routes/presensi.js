// routes/presensi.js
const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");

// PERBAIKAN: Pastikan import 'authenticateToken', bukan 'addUserData'
// Cek file middleware/permissionMiddleware.js Anda, pastikan nama export-nya sesuai.
const { authenticateToken } = require("../middleware/permissionMiddleware");

// Terapkan middleware auth ke semua route di bawah ini
// Ini PENTING agar req.user terisi data dari token
router.use(authenticateToken);

// Route Check-In & Check-Out
router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

// Route Update & Delete (Opsional/Admin)
router.put(
  "/:id",
  presensiController.validateUpdate,
  presensiController.updatePresensi
);

router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
