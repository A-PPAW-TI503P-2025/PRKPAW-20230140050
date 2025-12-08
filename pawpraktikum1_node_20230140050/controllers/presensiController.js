const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";
const { body, validationResult } = require("express-validator");

// --- 1. KONFIGURASI MULTER (UPLOAD FOTO) ---
const multer = require("multer");
const path = require("path");

// Konfigurasi tempat penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pastikan folder 'uploads' sudah dibuat di root project
  },
  filename: (req, file, cb) => {
    // Format nama file: userId-timestamp.jpg
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Filter agar hanya file gambar yang diterima
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang diperbolehkan!"), false);
  }
};

// Export middleware upload untuk dipakai di Router
exports.upload = multer({ storage: storage, fileFilter: fileFilter });
// -----------------------------------------------------------

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Ambil data lokasi dari body (Modul 9)
    const { latitude, longitude } = req.body;

    // Ambil path foto jika ada (Modul 10)
    const buktiFoto = req.file ? req.file.path : null;

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
      latitude: latitude, // Simpan Lokasi
      longitude: longitude, // Simpan Lokasi
      buktiFoto: buktiFoto, // Simpan Path Foto
    });

    const formattedData = {
      id: newRecord.id,
      userId: newRecord.userId,
      nama: userName,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      buktiFoto: buktiFoto,
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil!`,
      data: formattedData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    // Opsional: Ambil lokasi saat pulang
    const { latitude, longitude } = req.body;

    const recordToUpdate = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif.",
      });
    }

    recordToUpdate.checkOut = waktuSekarang;
    await recordToUpdate.save();

    const formattedData = {
      id: recordToUpdate.id,
      userId: recordToUpdate.userId,
      nama: userName,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone,
      }),
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil!`,
      data: formattedData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// ... (Sisa fungsi deletePresensi, validateUpdate, updatePresensi TETAP SAMA seperti sebelumnya) ...
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res.status(404).json({ message: "Catatan tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    await recordToDelete.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.validateUpdate = [
  body("checkIn").optional().isISO8601(),
  body("checkOut").optional().isISO8601(),
];

exports.updatePresensi = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate)
      return res.status(404).json({ message: "Catatan tidak ditemukan." });

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    await recordToUpdate.save();

    res.json({ message: "Berhasil update.", data: recordToUpdate });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
