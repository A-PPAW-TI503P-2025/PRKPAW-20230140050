"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * Method ini akan dipanggil otomatis oleh models/index.js
     */
    static associate(models) {
      // PERBAIKAN: Menambahkan relasi ke tabel Presensi
      // "Satu User memiliki banyak data Presensi"
      User.hasMany(models.Presensi, {
        foreignKey: "userId",
        as: "presensi", // Alias untuk pemanggilan relasi
      });
    }
  }

  User.init(
    {
      // Definisi kolom sesuai dengan migrasi create-user Anda
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "mahasiswa", // Default role jika tidak diisi
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  return User;
};
