import React from "react";
import { Link } from "react-router-dom";
import "../../index.css";

import LogoGruasUcab from "../../static/img/LogoGruasUcab.jpg";

const AdminNavbar = () => {
  const handleLogout = () => {
    alert("Sesión cerrada");
  };

  return (
    <div className="navbar bg-[#023430ff] fixed top-0 left-0 h-screen w-60 text-white p-4 flex flex-col justify-between">
      <div>
        <Link
          to="/AdminHome"
          className="flex items-center space-x-4 mb-8"
        >
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
          <li>
            <Link
              to="/AdminHome"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Inicio</div>
            </Link>
          </li>

          <li>
            <Link
              to="/AdminUsers"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Usuarios</div>
            </Link>
          </li>

          <li>
            <Link
              to="/AdminOrders"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Órdenes</div>
            </Link>
          </li>

          <li>
            <Link
              to="/AdminProviders"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Proveedores</div>
            </Link>
          </li>

          <li>
            <Link
              to="/AdminContracts"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Contratos</div>
            </Link>
          </li>

          <li>
            <Link
              to="/AdminProfile"
              className="navbar-link bg-[#00684aff] text-cyan-50 font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-[#07835fff] hover:shadow-xl transition-all"
            >
              <div className="px-4 py-2 text-white">Perfil</div>
            </Link>
          </li>
        </ul>
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 text-white font-semibold w-full h-14 flex items-center justify-center rounded-md shadow-lg hover:bg-red-700 hover:shadow-xl transition-all"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;