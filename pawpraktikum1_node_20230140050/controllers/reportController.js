const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    // 1. Filter Tanggal (di tabel Presensi)
    let presensiWhereClause = {};
    if (tanggalMulai && tanggalSelesai) {
      const startDate = new Date(tanggalMulai);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(tanggalSelesai);
      endDate.setHours(23, 59, 59, 999);

      presensiWhereClause.checkIn = {
        [Op.between]: [startDate, endDate],
      };
    }

    // 2. Filter Nama (di tabel User)
    let userWhereClause = {};
    if (nama) {
      userWhereClause.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll({
      where: presensiWhereClause,
      include: [
        {
          model: User,
          as: "user", // Pastikan alias ini sama dengan di models/presensi.js
          attributes: ["nama", "email"],
          where: userWhereClause, // Filter nama diterapkan di sini
        },
      ],
      order: [["checkIn", "DESC"]],
    });

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
