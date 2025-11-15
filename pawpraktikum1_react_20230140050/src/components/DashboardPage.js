import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Pastikan sudah di-install

// --- Kumpulan Ikon untuk Dashboard ---
const IconDashboard = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
  </svg>
);
const IconUserCircle = () => (
  <svg
    className="w-10 h-10 text-gray-300"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
      clipRule="evenodd"
    ></path>
  </svg>
);
const IconLogout = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
      clipRule="evenodd"
    ></path>
  </svg>
);
const IconMenu = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
      clipRule="evenodd"
    ></path>
  </svg>
);

function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // Untuk tampilan mobile

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.nama || "Pengguna");
      } catch (error) {
        handleLogout(); // Logout jika token error
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 text-white transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-800">
          <span className="text-2xl font-bold">AppSiswa</span>
        </div>
        <nav className="mt-4">
          <a
            href="#"
            className="flex items-center px-6 py-3 mt-2 text-gray-100 bg-gray-700"
          >
            <IconDashboard />
            <span className="ml-3">Dashboard</span>
          </a>
          {/* Tambahkan menu lain di sini */}
        </nav>
      </div>

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header (Navbar atas) */}
        <header className="flex justify-between items-center p-4 bg-white border-b shadow-md">
          {/* Tombol Menu Mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 focus:outline-none md:hidden"
          >
            <IconMenu />
          </button>

          <div className="text-xl font-semibold text-gray-700">
            Dashboard Utama
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <IconUserCircle />
            <span className="ml-2 mr-4 font-medium text-gray-700">
              {userName}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
            >
              <IconLogout />
              Logout
            </button>
          </div>
        </header>

        {/* Area Konten */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">
              Selamat Datang, {userName}!
            </h1>

            {/* Grid untuk Widget/Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Status Anda
                </h2>
                <p className="text-gray-600">
                  Anda login sebagai{" "}
                  <span className="font-bold text-blue-600">Mahasiswa</span>.
                </p>
              </div>
              {/* Card 2 */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Mata Kuliah
                </h2>
                <p className="text-gray-600">
                  Tidak ada mata kuliah yang diambil saat ini.
                </p>
              </div>
              {/* Card 3 */}
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Bantuan
                </h2>
                <p className="text-gray-600">
                  Hubungi admin jika mengalami kendala.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;
