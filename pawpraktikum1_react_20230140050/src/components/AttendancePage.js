import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import Webcam from "react-webcam"; // Import Webcam

// Fix Icon Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
});

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState(null); // State foto selfie

  const webcamRef = useRef(null);

  const getToken = () => localStorage.getItem("token");

  // Ambil Lokasi
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
        (error) => {
          setError("Gagal mendapatkan lokasi: " + error.message);
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation tidak didukung browser ini.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  // Fungsi Capture Foto Selfie
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // --- CHECK-IN (Dengan Foto) ---
  const handleCheckIn = async () => {
    setMessage("");
    setError("");

    if (!coords || !image) {
      setError("Lokasi dan Foto Selfie wajib ada!");
      return;
    }

    try {
      // 1. Konversi Base64 ke Blob
      const blob = await (await fetch(image)).blob();

      // 2. Buat FormData
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "selfie.jpg"); // Nama field harus 'image' sesuai Multer

      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data", // Header wajib upload
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/attendance/check-in",
        formData, // Kirim FormData, bukan JSON
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(err.response ? err.response.data.message : "Check-in gagal");
    }
  };

  // --- CHECK-OUT ---
  const handleCheckOut = async () => {
    setMessage("");
    setError("");

    if (!coords) {
      setError("Lokasi belum didapatkan.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${getToken()}` },
      };

      // Check-out biasanya tidak wajib foto (opsional, tergantung kebijakan)
      // Di sini kita pakai JSON biasa seperti sebelumnya
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
      {/* 1. Bagian Peta */}
      {isLoading ? (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-4xl mb-6 text-center animate-pulse">
          Sedang memuat lokasi...
        </div>
      ) : coords ? (
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-4xl mb-6">
          <h3 className="text-lg font-bold mb-4">Lokasi Anda:</h3>
          <div className="border rounded-lg overflow-hidden h-64 z-0 relative">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Posisi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      ) : (
        <div className="bg-red-100 p-4 rounded text-red-700 w-full max-w-4xl mb-6 text-center">
          {error || "Lokasi tidak ditemukan"}
        </div>
      )}

      {/* 2. Bagian Kamera (Selfie) */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg text-center mb-6">
        <h3 className="text-lg font-bold mb-4">Ambil Foto Selfie</h3>

        <div className="border-2 border-gray-300 border-dashed rounded-lg overflow-hidden bg-black mb-4 relative h-64 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="Selfie"
              className="w-full h-full object-cover"
            />
          ) : (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="w-full h-full object-cover"
              videoConstraints={{ facingMode: "user" }}
            />
          )}
        </div>

        {!image ? (
          <button
            onClick={capture}
            className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition"
          >
            📸 Ambil Foto
          </button>
        ) : (
          <button
            onClick={() => setImage(null)}
            className="bg-gray-500 text-white px-6 py-2 rounded-full font-bold hover:bg-gray-600 transition"
          >
            🔄 Foto Ulang
          </button>
        )}
      </div>

      {/* 3. Tombol Aksi */}
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-lg text-center">
        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleCheckIn}
            disabled={!coords || !image}
            className={`py-3 px-4 rounded-xl text-white font-bold shadow ${
              !coords || !image
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            disabled={!coords}
            className={`py-3 px-4 rounded-xl text-white font-bold shadow ${
              !coords
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
