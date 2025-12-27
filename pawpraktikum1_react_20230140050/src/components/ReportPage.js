import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. STATE UNTUK MODAL (Menyimpan URL foto yang sedang diklik)
  const [selectedImage, setSelectedImage] = useState(null);

  const navigate = useNavigate();

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: { nama: query },
      };

      // Pastikan port backend benar (biasanya 3001)
      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        config
      );
      setReports(response.data.data || response.data);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil data"
      );
    }
  };

  useEffect(() => {
    fetchReports("");
  }, [navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Laporan Presensi Harian
      </h1>

      <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Cari berdasarkan nama..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="py-2 px-6 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Cari
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-4 border border-red-200">
          {error}
        </p>
      )}

      {!error && (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Bukti Foto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length > 0 ? (
                  reports.map((presensi) => (
                    <tr
                      key={presensi.id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {presensi.user ? presensi.user.nama : "N/A"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {new Date(presensi.checkIn).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                        })}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        {presensi.checkOut
                          ? new Date(presensi.checkOut).toLocaleString(
                              "id-ID",
                              { timeZone: "Asia/Jakarta" }
                            )
                          : "Belum Check-Out"}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        {presensi.latitude ? (
                          <div>
                            <div>Lat: {presensi.latitude}</div>
                            <div>Lng: {presensi.longitude}</div>
                          </div>
                        ) : (
                          "N/A"
                        )}
                      </td>

                      {/* --- 2. TAMPILAN THUMBNAIL FOTO --- */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {presensi.buktiFoto ? (
                          <img
                            // Mengambil gambar dari backend (Static folder uploads)
                            src={`http://localhost:3001/${presensi.buktiFoto}`}
                            alt="Bukti"
                            className="h-12 w-12 rounded-full object-cover cursor-pointer border-2 border-gray-200 hover:border-blue-500 transition-all hover:scale-110 shadow-sm"
                            // Saat diklik, simpan URL ke state selectedImage untuk membuka Modal
                            onClick={() =>
                              setSelectedImage(
                                `http://localhost:3001/${presensi.buktiFoto}`
                              )
                            }
                          />
                        ) : (
                          <span className="text-gray-400 text-xs italic">
                            Tidak ada foto
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-500 italic"
                    >
                      Tidak ada data presensi yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- 3. MODAL / POPUP FOTO UKURAN PENUH --- */}
      {/* Hanya muncul jika selectedImage tidak null */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 backdrop-blur-sm transition-opacity"
          onClick={() => setSelectedImage(null)} // Klik background hitam untuk tutup
        >
          <div
            className="relative bg-white p-2 rounded-lg shadow-2xl max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-300 text-gray-800 rounded-full w-8 h-8 flex items-center justify-center font-bold transition z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Bukti Full"
              className="w-full h-auto rounded-md border border-gray-200"
            />
            <div className="text-center mt-3 text-sm font-semibold text-gray-600">
              Bukti Foto Presensi
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
