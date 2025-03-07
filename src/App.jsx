import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UploadDocument from "./pages/UploadDocument";
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";
import ProcessPDF from "./pages/ProcessPDF";
import Navbar from "./components/Navbar";
import "./styles/global.css";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/upload" element={<PrivateRoute><UploadDocument /></PrivateRoute>} />
          <Route path="/view/:id" element={<PrivateRoute><ViewDocument /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><EditDocument /></PrivateRoute>} />
          <Route path="/process/:id" element={<PrivateRoute><ProcessPDF /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;