import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddUserForm from "../../components/AdminComponents/AdminAddUserForm";
import AdminUpdateUserForm from "../../components/AdminComponents/AdminUpdateUserForm";


const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
      const role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(role);

      if (role !== "Admin" && role !== "Operator") {
        console.error("Acceso denegado: Rol no autorizado.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/user-api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const formattedUsers = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: user.userType,
        status: user.isActive ? "Activo" : "Inactivo",
        isTemporaryPassword: user.isTemporaryPassword ? "En espera" : "Finalizada",
        department: user.department,
      }));
      setUsers(formattedUsers);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error al cargar la lista de usuarios. Intenta nuevamente.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    try {
      await fetchUsers();
      setSuccessMessage("¡Usuario agregado exitosamente!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar la lista de usuarios:", error.message);
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );
      setSuccessMessage("¡Usuario actualizado exitosamente!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar usuario:", error.message);
      setErrorMessage("Error al actualizar el usuario. Intenta nuevamente.");
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filterStatus === "" || user.status === filterStatus) &&
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Cargando datos...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />

      <div className="flex-1 ml-30 p-8 bg-gray-100 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta y administra los usuarios registrados.
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md animate-bounce">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <button
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Usuario
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">Nombre</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Email</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Teléfono</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tipo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Departamento</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Clave Temporal</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.type}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${user.status === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.department}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${user.isTemporaryPassword === "En espera"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                        }`}
                    >
                      {user.isTemporaryPassword}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowUpdateForm(true);
                      }}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <AdminAddUserForm
            onClose={() => setShowAddForm(false)}
            onAddUser={handleAddUser}
          />
        )}

        {showUpdateForm && selectedUser && (
          <AdminUpdateUserForm
            user={selectedUser}
            onClose={() => setShowUpdateForm(false)}
            onUpdateSuccess={handleUpdateUser}
            onError={(error) => setErrorMessage(error)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
