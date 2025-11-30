import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchReports = async (query = "") => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const response = await axios.get(
        "http://localhost:3001/api/reports/daily",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { nama: query },
        }
      );
      setReports(response.data.data || response.data);
      setError(null);
    } catch (err) {
      setError("Gagal mengambil data laporan.");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return <span className="text-gray-400 italic">-</span>;
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-md border-l-8 border-purple-600 flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800">
            Laporan Presensi Harian
          </h1>
          <p className="text-gray-500 mt-1">
            Data kehadiran seluruh mahasiswa/pegawai.
          </p>
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchReports(searchTerm);
          }}
          className="mt-4 md:mt-0 relative w-full md:w-72"
        >
          <input
            type="text"
            placeholder="Cari nama..."
            className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-2 top-1.5 bg-purple-100 p-1 rounded-md text-purple-600 hover:bg-purple-200 transition"
          >
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-xl shadow-sm border border-red-200">
          {error}
        </div>
      )}

      {/* Tabel Data */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Masuk
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Pulang
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Lokasi (Lat, Lng)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length > 0 ? (
                reports.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-purple-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold mr-3">
                          {item.user?.nama?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          {item.user?.nama || "User Dihapus"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {formatDate(item.checkIn)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.checkOut
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {formatDate(item.checkOut)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.latitude && item.longitude ? (
                        <div className="flex flex-col text-xs">
                          <span>Lat: {item.latitude}</span>
                          <span>Lng: {item.longitude}</span>
                        </div>
                      ) : (
                        <span className="text-red-400 italic text-xs">
                          Lokasi tidak ada
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    Belum ada data presensi hari ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
