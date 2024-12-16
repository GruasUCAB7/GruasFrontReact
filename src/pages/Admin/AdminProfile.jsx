import React, { useState } from "react";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    id: 1,
    name: "Andres Ragua",
    email: "andres@gruasucab.com",
    phone: "+58 4121512539",
    role: "Administrador",
    department: "TI",
    creationDate: "01/01/2023",
    profilePicture: "https://via.placeholder.com/150",
    password: "********",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(adminData);
  const [showPassword, setShowPassword] = useState(false);

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => {
    setAdminData(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = () => {
    alert("Cambiar contraseña no está implementado aún.");
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 ml-60 p-8 bg-gray-100 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="relative flex flex-col items-center mb-6">
            <div className="relative w-32 h-32">
              <img
                src={adminData.profilePicture}
                alt="Foto de Perfil"
                className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-[#00684aff] text-white p-2 rounded-full shadow-lg hover:bg-[#07835fff] transition">
                  <i className="fas fa-camera"></i>
                </button>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-4">
              {adminData.name}
            </h1>
            <p className="text-gray-600 text-lg">{adminData.role}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Información General
              </h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Email:</p>
                <p className="text-gray-500">{adminData.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Teléfono:</p>
                <p className="text-gray-500">{adminData.phone}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Departamento:</p>
                <p className="text-gray-500">{adminData.department}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Fecha de Creación:</p>
                <p className="text-gray-500">{adminData.creationDate}</p>
              </div>
            </div>

            {isEditing && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                  Editar Información
                </h2>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium">
                    Departamento
                  </label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
              Seguridad
            </h2>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-700 font-medium">Contraseña:</p>
              <div className="flex items-center space-x-4">
                <p className="text-gray-500">
                  {showPassword ? "12345678" : "********"}
                </p>
                <button
                  onClick={togglePasswordVisibility}
                  className="bg-gray-300 text-gray-800 px-2 py-1 rounded-md hover:bg-gray-400 transition"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handlePasswordChange}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Cambiar Contraseña
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
                >
                  Guardar Cambios
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
