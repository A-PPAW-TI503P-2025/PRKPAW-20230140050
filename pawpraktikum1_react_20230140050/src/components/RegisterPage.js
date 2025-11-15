import React, { useState } from "react";
import axios from "axios";
// Impor 'Link' untuk navigasi kembali ke halaman Login
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  // State untuk field baru: nama dan role
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa"); // Default value 'mahasiswa'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Bersihkan error sebelumnya

    try {
      // Kirim data ke endpoint register
      await axios.post("http://localhost:3001/api/auth/register", {
        nama: nama,
        email: email,
        password: password,
        role: role,
      });

      // Jika sukses, arahkan ke halaman login
      navigate("/login");
    } catch (err) {
      // Tangani error, mirip dengan LoginPage [cite: 105]
      setError(err.response ? err.response.data.message : "Registrasi gagal");
    }
  };

  // Gunakan struktur JSX dan Tailwind dari LoginPage.js [cite: 108-159]
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Field: Nama */}
          <div>
            <label
              htmlFor="nama"
              className="block text-sm font-medium text-gray-700"
            >
              Nama:
            </label>
            <input
              id="nama"
              type="text"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Field: Email (Struktur dari LoginPage) [cite: 115-129] */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Field: Password (Struktur dari LoginPage) [cite: 131-145] */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Field: Role (Dropdown)  */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
              Role:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="mahasiswa">Mahasiswa</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Register
          </button>
        </form>

        {/* Tampilkan error jika ada [cite: 154-156] */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Link untuk kembali ke Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
