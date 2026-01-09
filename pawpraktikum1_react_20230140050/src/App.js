import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import AttendancePage from "./components/AttendancePage";
import ReportPage from "./components/ReportPage";
import SensorPage from "./components/SensorPage"; // 1. Import Halaman Sensor
import Navbar from "./components/Navbar";
import "leaflet/dist/leaflet.css";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />

          {/* 2. FIX: Mengubah path menjadi /presensi sesuai komentar Anda */}
          <Route
            path="/presensi"
            element={
              <MainLayout>
                <AttendancePage />
              </MainLayout>
            }
          />

          {/* Halaman Laporan */}
          <Route
            path="/reports"
            element={
              <MainLayout>
                <ReportPage />
              </MainLayout>
            }
          />

          {/* 3. BARU: Route untuk Monitoring Sensor (Sesuai Modul Langkah 4) */}
          <Route
            path="/monitoring"
            element={
              <MainLayout>
                <SensorPage />
              </MainLayout>
            }
          />

          <Route path="/" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
