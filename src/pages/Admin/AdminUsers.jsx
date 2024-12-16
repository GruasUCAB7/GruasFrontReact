import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddUserForm from "../../components/AdminComponents/AdminAddUserForm";
import AdminUpdateUserForm from "../../components/AdminComponents/AdminUpdateUserForm";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/user-api/user");
        const formattedUsers = response.data.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          type: user.userType,
          status: user.isActive ? "Activo" : "Inactivo",
          department: user.department,
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Error al obtener la lista de usuarios:", error.message);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    return (
      (filterStatus === "" || user.status === filterStatus) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddUser = (newUser) => {
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
    );
    setAlertMessage({ type: "success", text: "Usuario actualizado correctamente." });
  };

  const handleError = (message) => {
    setAlertMessage({ type: "error", text: message });
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 ml-60 p-8 bg-gray-100 overflow-auto">
        {alertMessage && (
          <div
            className={`p-4 mb-4 rounded-lg text-white ${
              alertMessage.type === "success" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {alertMessage.text}
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta, filtra y administra los usuarios registrados en el sistema.
          </p>
        </div>

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
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md hover:bg-[#07835fff] transition"
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
                <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Departamento</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.phone}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.type}</td>
                  <td
                    className={`px-6 py-4 font-semibold text-sm ${
                      user.status === "Activo" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {user.status}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.department}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowEditForm(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <i className="fas fa-edit"></i> Editar
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

        {showEditForm && selectedUser && (
          <AdminUpdateUserForm
            user={selectedUser}
            onClose={() => setShowEditForm(false)}
            onUpdateSuccess={handleUpdateUser}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
