import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import LogoGruasUcab from "../../static/img/LogoGruasUcab.jpg";
import LogoutPrompt from "../LogOutComponent/LogOutPrompt";

const AdminNavbar = ({ userRole }) => {
  const [isLogoutPromptOpen, setIsLogoutPromptOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      try {
        const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
        const userIdFromToken = tokenPayload.sub;
        setUserId(userIdFromToken);
      } catch (error) {
        navigate("/login");
      }
    }
  }, [navigate]);

  const menuItems = [
    {
      key: "home",
      title: "Inicio",
      path: "/AdminHome",
      roles: ["Admin", "Operator", "Provider"],
    },
    {
      key: "usuarios",
      title: "Usuarios",
      path: "/AdminUsers",
      roles: ["Admin", "Operator"],
    },
    {
      key: "ordenes",
      title: "Órdenes",
      path: userId ? `/AdminOrders/${userId}` : "/AdminOrders",
      roles: ["Admin", "Operator"],
    },
    {
      key: "proveedores",
      title: "Proveedores",
      path: "/AdminProviders",
      roles: ["Admin", "Operator"],
    },
    {
      key: "GruasProveedor",
      title: "Gruas",
      path: userId ? `/ProviderCranes/${userId}` : "/Provider",
      roles: ["Provider"],
    },
    {
      key: "ConductoresProveedor",
      title: "Conductores",
      path: userId ? `/ProviderDrivers/${userId}` : "/Provider",
      roles: ["Provider"],
    },
    {
      key: "perfil",
      title: "Perfil",
      path: "/AdminProfile",
      roles: ["Admin", "Operator", "Provider"],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="navbar bg-[#023430ff] fixed top-0 left-0 h-screen w-60 text-white p-4 flex flex-col justify-between">
      <div>
        <Link to="/AdminHome" className="flex items-center space-x-4 mb-8">
          <img
            src={LogoGruasUcab}
            alt="Logo Gruas"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full"
          />
          <span className="text-white text-lg sm:text-xl font-bold">
            GruasUCAB
          </span>
        </Link>

        <ul className="navbar-menu flex flex-col space-y-4">
          {menuItems
            .filter((item) => item.roles.includes(userRole))
            .map((item) => (
              <li key={item.key}>
                <Link
                  to={item.path}
                  className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
                >
                  <div className="px-4 py-2 text-white">{item.title}</div>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={() => setIsLogoutPromptOpen(true)}
        className="bg-red-600 text-white font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-red-700 hover:shadow-xl transition-all"
      >
        Logout
      </button>

      <LogoutPrompt
        isOpen={isLogoutPromptOpen}
        onCancel={() => setIsLogoutPromptOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default AdminNavbar;
