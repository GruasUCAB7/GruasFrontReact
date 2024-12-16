import React from "react";
import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";

const AdminHome = () => {
  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido, Administrador</h1>
          <p className="text-lg text-gray-600 mt-2">
            Administra y consulta la información de usuarios, órdenes, y proveedores desde este panel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#00684aff] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Usuarios</h2>
            <p className="text-gray-600 mt-2 text-center">
              Gestiona la información general de los usuarios registrados.
            </p>
            <Link
              to="/AdminUsers"
              className="bg-[#00684aff] text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-[#07835fff] transition"
            >
              Ver Usuarios
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#00684aff] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-list text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Órdenes</h2>
            <p className="text-gray-600 mt-2 text-center">
              Revisa y gestiona las órdenes creadas en el sistema.
            </p>
            <Link
              to="/AdminOrders"
              className="bg-[#00684aff] text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-[#07835fff] transition"
            >
              Ver Ordenes
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#00684aff] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-truck text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Proveedores</h2>
            <p className="text-gray-600 mt-2 text-center">
              Gestiona la información de tus proveedores.
            </p>
            <Link
              to="/AdminProviders"
              className="bg-[#00684aff] text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-[#07835fff] transition"
            >
              Ver Proveedores
            </Link>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <div className="bg-[#00684aff] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-user text-2xl"></i>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Perfil</h2>
            <p className="text-gray-600 mt-2 text-center">
              Consulta y actualiza la información de tu perfil.
            </p>
            <Link
              to="/AdminProfile"
              className="bg-[#00684aff] text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-[#07835fff] transition"
            >
              Ver Perfil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
