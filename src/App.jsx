import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/navbar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AutoLogout from './components/autoLogout';
import AdminPage from "./pages/AdminPage";
import StaffPage from "./pages/StaffPage";
import InventoryPage from './pages/InventoryPage';
import MonthlyReport from './pages/MonthlyReport';


function App() {
  return (
  <>
    <Navbar />
    <AutoLogout />
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <ProtectedRoute role="admin">
            <Signup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
            <InventoryPage />
        }
      />
      <Route
        path="/report"
        element={
            <MonthlyReport />
        }
      />
    </Routes>
  </>
  );
}

export default App;
