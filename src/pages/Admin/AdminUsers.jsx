import React, { useState } from "react";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddUserForm from "../../components/AdminComponents/AdminAddUserForm";

const AdminUsers = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Juan",
      email: "juan@email.com",
      phone: "+58 4121512539",
      type: "Operador",
      status: "Activo",
      department: "Departamento",
      creationDate: "01/01/2023",
    },
    {
      id: 2,
      name: "María",
      email: "maria@email.com",
      phone: "+58 4121512539",
      type: "Administrador",
      status: "Inactivo",
      department: "TI",
      creationDate: "15/03/2023",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

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

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 ml-60 p-8 bg-gray-100 overflow-auto">
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
                <th className="px-6 py-3 text-left font-medium text-sm">ID</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Nombre</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Email</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Teléfono</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tipo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Departamento</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Fecha Creación</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{user.id}</td>
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
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {user.creationDate}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    {/* Botón Editar */}
                    <button
                      onClick={() => alert(`Editar usuario: ${user.name}`)}
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
      </div>
    </div>
  );
};

export default AdminUsers;
