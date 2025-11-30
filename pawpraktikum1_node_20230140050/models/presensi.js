"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relasi ke User sudah benar
      Presensi.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Presensi.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // Kolom 'nama' sudah dihapus (Benar)

      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkOut: {
        type: DataTypes.DATE,
        allowNull: true, // Boleh null
      },
      // --- PERBAIKAN: MENAMBAHKAN DEFINISI LATITUDE & LONGITUDE ---
      latitude: {
        type: DataTypes.DECIMAL(10, 8), // Sesuaikan tipe data dengan migrasi
        allowNull: true,
      },
      longitude: {
        type: DataTypes.DECIMAL(11, 8), // Sesuaikan tipe data dengan migrasi
        allowNull: true,
      },
      // ------------------------------------------------------------
    },
    {
      sequelize,
      modelName: "Presensi",
    }
  );
  return Presensi;
};
