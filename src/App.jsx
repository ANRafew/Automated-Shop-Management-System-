import { useState } from 'react'
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPage from "./pages/AdminPage";
import StaffPage from "./pages/StaffPage";
import InventoryPage from './pages/InventoryPage';
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from './components/navbar';

function App() {
  return (
  <>
    <Navbar />
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

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
    </Routes>
  </>
  );
}

export default App;
