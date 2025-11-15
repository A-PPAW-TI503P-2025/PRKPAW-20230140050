import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// Impor ikon (Anda bisa gunakan React Icons atau SVG)
// Untuk kesederhanaan, kita gunakan karakter emoji
const IconEmail = () => (
  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    <svg
      className="w-5 h-5 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M2.003 5.884l7.997 5.191 7.997-5.191A2 2 0 0016.172 5H3.828a2 2 0 00-1.825.884zM18 8.116l-7.997 5.191L2 8.116V14a2 2 0 002 2h12a2 2 0 002-2V8.116z"></path>
    </svg>
  </span>
);
const IconPassword = () => (
  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
    <svg
      className="w-5 h-5 text-gray-400"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M10 2a5 5 0 00-5 5v2H3a2 2 0 00-2 2v5a2 2 0 002 2h14a2 2 0 002-2v-5a2 2 0 00-2-2h-2V7a5 5 0 00-5-5zM9 11v3H7v-3H9zM10 7a3 3 0 013 3v1H7V10a3 3 0 013-3z"></path>
    </svg>
  </span>
);
const IconAppLogo = () => (
  <svg
    className="w-12 h-12 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    ></path>
  </svg>
);

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email: email,
          password: password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 w-full max-w-md">
        {/* Header: Logo dan Judul */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <IconAppLogo />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Login ke Akun Anda
          </h2>
          <p className="text-gray-500 mt-2">Selamat datang kembali!</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email:
            </label>
            <IconEmail />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password:
            </label>
            <IconPassword />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            Masuk
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Link ke Register */}
        <p className="text-sm text-center text-gray-600 mt-8">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-500"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
