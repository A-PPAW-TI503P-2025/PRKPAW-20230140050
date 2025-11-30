import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css"; // Pastikan CSS Leaflet diimpor

// --- FIX: Konfigurasi Icon Marker Leaflet ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
});
// ---------------------------------------------

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // {lat, lng}
  const [isLoading, setIsLoading] = useState(true);

  const getToken = () => localStorage.getItem("token");

  // Fungsi ambil lokasi
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoading(false);
        },
        (err) => {
          setError("Gagal mendapatkan lokasi: " + err.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // --- FUNGSI CHECK-IN ---
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };

      const response = await axios.post(
        "http://localhost:3001/api/attendance/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  // --- FUNGSI CHECK-OUT (PERBAIKAN) ---
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon tunggu sebentar.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };

      // PERBAIKAN: Kirim lokasi saat check-out juga
      const response = await axios.post(
        "http://localhost:3001/api/attendance/check-out",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-out gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center pt-10 pb-10 px-4">
      {/* Bagian Peta / Loading */}
      {isLoading ? (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mb-8 text-center animate-pulse">
          <p className="text-lg font-semibold text-blue-600">
            Sedang mencari lokasi GPS Anda...
          </p>
        </div>
      ) : coords ? (
        <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-4xl mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-4">
            Lokasi Anda Saat Ini:
          </h3>
          <div className="border-2 border-gray-200 rounded-lg overflow-hidden h-[350px] relative z-0">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Posisi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Lat: {coords.lat}, Lng: {coords.lng}
          </p>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-xl shadow w-full max-w-4xl mb-8 border border-red-200">
          <p className="text-red-600 font-bold text-center">
            {error || "Lokasi tidak ditemukan."}
          </p>
        </div>
      )}

      {/* Bagian Tombol Aksi */}
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center transform transition hover:scale-105 duration-300">
        <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
          Catat Kehadiran
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold border border-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm font-semibold border border-red-200">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCheckIn}
            disabled={!coords}
            className={`w-full py-4 px-4 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 ${
              !coords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Check-In (Masuk)
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!coords}
            className={`w-full py-4 px-4 text-white font-bold rounded-xl shadow-md transition-transform active:scale-95 ${
              !coords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Check-Out (Pulang)
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
