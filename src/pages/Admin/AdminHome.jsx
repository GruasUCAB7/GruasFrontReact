import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";

const AdminHome = () => {
  const [userName, setUserName] = useState("Nombre no encontrado");
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(authToken);
      setUserName(decodedToken.name || "Nombre no encontrado");
      setUserRole(
        decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Sin Rol"
      );
      setUserId(decodedToken.sub);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const sections = [
    {
      key: "usuarios",
      title: "Usuarios",
      description: "Gestiona la información general de los usuarios registrados.",
      icon: "fas fa-users",
      path: "/AdminUsers",
      roles: ["Admin", "Operator"],
    },
    {
      key: "ordenes",
      title: "Órdenes",
      description: "Consulta y gestiona las órdenes creadas en el sistema.",
      icon: "fas fa-list",
      path: "/AdminOrders",
      roles: ["Admin", "Operator"],
    },
    {
      key: "proveedores",
      title: "Proveedores",
      description: "Gestiona la información de tus proveedores.",
      icon: "fas fa-truck",
      path: "/AdminProviders",
      roles: ["Admin", "Operator"],
    },
    {
      key: "contratos",
      title: "Contratos",
      description: "Consulta los contratos registrados en el sistema.",
      icon: "fas fa-file-contract",
      path: "/AdminContracts",
      roles: ["Admin", "Operator"],
    },
    {
      key: "perfil",
      title: "Perfil",
      description: "Consulta y actualiza la información de tu perfil.",
      icon: "fas fa-user",
      path: "/AdminProfile",
      roles: ["Admin", "Operator", "Provider"],
    },
    // Providers
    {
      key: "gruas",
      title: "Gruas",
      description: "Consulta y actualiza la información de tus grúas.",
      icon: "fa-solid fa-truck",
      path: `/ProviderCranes/${userId}`,
      roles: ["Provider"],
    },
    {
      key: "conductores",
      title: "Conductores",
      description: "Consulta y actualiza la información de tus conductores.",
      icon: "fa-regular fa-id-card",
      path: `/ProviderDrivers/${userId}`,
      roles: ["Provider"],
    },
  ];

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />
      <div className="flex-1 pl-30 p-8 bg-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Bienvenido a Grúas UCAB, {userName}
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Panel de Administración para los {userRole}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections
            .filter((section) => section.roles.includes(userRole))
            .map((section) => (
              <div
                key={section.key}
                className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
              >
                <div className="bg-[#00684aff] text-white w-16 h-16 flex items-center justify-center rounded-full mb-4">
                  <i className={`${section.icon} text-2xl`}></i>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h2>
                <p className="text-gray-600 mt-2 text-center">
                  {section.description}
                </p>
                <Link
                  to={section.path}
                  className="bg-[#00684aff] text-white font-semibold px-4 py-2 rounded-md mt-4 hover:bg-[#07835fff] transition"
                >
                  Ver {section.title}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;