import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./index.css";

import AdminHome from "./pages/Admin/AdminHome";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProviders from "./pages/Admin/AdminProviders";
import AdminCranes from "./pages/Admin/AdminCranes";
import AdminContracts from "./pages/Admin/AdminContracts";
import AdminProfile from "./pages/Admin/AdminProfile";
//import AdminContractDetail from "./components/AdminComponents/AdminContractDetail";
//import AdminProvidersDetail from "./components/AdminComponents/AdminProviderDetail";
import AdminNavbar from "./components/AdminComponents/AdminNavBar";

//Providers
import ProviderCranes from "./pages/Provider/ProviderCranes";
import ProviderDrivers from "./pages/Provider/ProviderDrivers";

import Login from "./pages/Login/Login";
import ChangePassword from "./pages/Login/ChangePassword";

const AdminLayout = ({ children, userRole }) => (
  <div className="flex">
    <AdminNavbar userRole={userRole} />
    <div className="flex-1 ml-60 bg-gray-100 p-8">{children}</div>
  </div>
);

const PrivateRoute = ({ children, allowedRoles }) => {
  const authToken = localStorage.getItem("authToken");

  if (!authToken) {
    console.error("AuthToken no encontrado. Redirigiendo al login.");
    return <Navigate to="/Login" />;
  }

  try {
    const tokenParts = authToken.split(".");
    if (tokenParts.length !== 3) {
      throw new Error("El token no tiene el formato adecuado.");
    }

    const tokenPayload = jwtDecode(authToken);
    const userRole = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    const isExpired = tokenPayload.exp * 1000 < Date.now();

    if (isExpired) {
      console.error("Token expirado. Redirigiendo al login.");
      localStorage.removeItem("authToken");
      return <Navigate to="/Login" />;
    }

    if (!allowedRoles.includes(userRole)) {
      console.error("Rol no permitido. Redirigiendo al login.");
      return <Navigate to="/Login" />;
    }

    return children;
  } catch (error) {
    console.error("Error al decodificar el token:", error.message);
    localStorage.removeItem("authToken");
    return <Navigate to="/Login" />;
  }
};

const App = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      try {
        const decodedToken = jwtDecode(authToken);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (!isExpired) {
          setUserRole(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        } else {
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/Login" replace />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route
          path="/AdminHome"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator", "Provider"]}>
              <AdminLayout userRole={userRole}>
                <AdminHome />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminUsers"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator"]}>
              <AdminLayout userRole={userRole}>
                <AdminUsers />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminProviders"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator", "Provider"]}>
              <AdminLayout userRole={userRole}>
                <AdminProviders />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminOrders"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator"]}>
              <AdminLayout userRole={userRole}>
                <AdminOrders />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminCranes"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator", "Provider"]}>
              <AdminLayout userRole={userRole}>
                <AdminCranes />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminContracts"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator", "Provider"]}>
              <AdminLayout userRole={userRole}>
                <AdminContracts />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/AdminProfile"
          element={
            <PrivateRoute allowedRoles={["Admin", "Operator", "Provider"]}>
              <AdminLayout userRole={userRole}>
                <AdminProfile />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProviderCranes/:id"
          element={
            <PrivateRoute allowedRoles={["Provider"]}>
              <AdminLayout userRole={userRole}>
                <ProviderCranes />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/ProviderDrivers/:id"
          element={
            <PrivateRoute allowedRoles={["Provider"]}>
              <AdminLayout userRole={userRole}>
                <ProviderDrivers />
              </AdminLayout>
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
};

export default App;
