import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ nama: "User", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // --- KOMPONEN: DASHBOARD MAHASISWA ---
  const StudentDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
      {/* Kartu 1: Presensi (Paling Penting) */}
      <div
        onClick={() => navigate("/attendance")}
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer relative overflow-hidden group"
      >
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-2 -translate-y-2">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-1">Presensi Sekarang</h3>
          <p className="text-blue-100 text-sm mb-6">
            Catat kehadiran masuk atau pulang Anda di sini.
          </p>
          <span className="bg-white text-blue-700 px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-gray-100 transition">
            Buka Peta &rarr;
          </span>
        </div>
      </div>

      {/* Kartu 2: Status Mahasiswa */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-green-500 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-700">Status Akademik</h3>
          <span className="p-2 bg-green-100 text-green-600 rounded-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </span>
        </div>
        <div className="text-3xl font-bold text-gray-800 mb-1">Aktif</div>
        <p className="text-gray-500 text-sm">Semester Ganjil 2025/2026</p>
      </div>

      {/* Kartu 3: Pengumuman/Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-t-4 border-yellow-500 hover:shadow-lg transition duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-700">Info Kampus</h3>
          <span className="p-2 bg-yellow-100 text-yellow-600 rounded-full">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              ></path>
            </svg>
          </span>
        </div>
        <p className="text-gray-600 text-sm">
          Tidak ada pengumuman penting hari ini. Tetap semangat belajar!
        </p>
      </div>
    </div>
  );

  // --- KOMPONEN: DASHBOARD ADMIN ---
  const AdminDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
      {/* Kartu Utama: Laporan */}
      <div
        onClick={() => navigate("/reports")}
        className="md:col-span-2 bg-gradient-to-r from-purple-700 to-indigo-800 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300 cursor-pointer relative overflow-hidden group"
      >
        <div className="absolute right-0 bottom-0 opacity-10 p-4">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <div className="relative z-10">
          <div className="bg-white/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-1">Data Laporan</h3>
          <p className="text-purple-200 text-sm mb-6 max-w-sm">
            Pantau kehadiran harian seluruh pegawai/mahasiswa secara real-time.
          </p>
          <span className="bg-white text-purple-800 px-5 py-2 rounded-lg text-sm font-bold shadow hover:bg-gray-100 transition">
            Lihat Tabel &rarr;
          </span>
        </div>
      </div>

      {/* Kartu Statistik 1 */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-blue-500 flex flex-col items-center justify-center text-center">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
        </div>
        <span className="text-3xl font-extrabold text-gray-800">150+</span>
        <span className="text-xs text-gray-500 uppercase font-semibold mt-1">
          Total User
        </span>
      </div>

      {/* Kartu Statistik 2 */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-b-4 border-green-500 flex flex-col items-center justify-center text-center">
        <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <span className="text-3xl font-extrabold text-gray-800">98%</span>
        <span className="text-xs text-gray-500 uppercase font-semibold mt-1">
          Kehadiran Hari Ini
        </span>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-10">
      {/* 1. HEADER / WELCOME BANNER (Bersih tanpa tombol logout) */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Selamat Datang, <span className="text-blue-600">{user.nama}</span>!
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            {user.role === "admin"
              ? "Anda berada di Panel Administrator."
              : "Semoga harimu menyenangkan!"}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <span
            className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider shadow-sm ${
              user.role === "admin"
                ? "bg-purple-100 text-purple-800 border border-purple-200"
                : "bg-blue-100 text-blue-800 border border-blue-200"
            }`}
          >
            {user.role || "Pengguna"}
          </span>
        </div>
      </div>

      {/* 2. KONTEN (Otomatis berubah sesuai Role) */}
      {user.role === "admin" ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}

export default DashboardPage;
