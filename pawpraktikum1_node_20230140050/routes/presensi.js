const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { authenticateToken } = require("../middleware/permissionMiddleware");

// Terapkan middleware auth ke semua route (Wajib Login)
router.use(authenticateToken);

// --- PERBAIKAN UTAMA DI SINI ---
// Tambahkan 'presensiController.upload.single('image')' sebelum 'presensiController.CheckIn'
// Ini agar foto selfie bisa diproses oleh Multer sebelum masuk ke Controller
router.post(
  "/check-in",
  presensiController.upload.single("image"),
  presensiController.CheckIn
);

router.post("/check-out", presensiController.CheckOut);

// Route Update & Delete (Opsional)
router.put(
  "/:id",
  presensiController.validateUpdate,
  presensiController.updatePresensi
);

router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
