import React, { useState } from "react";
import axios from "../../axiosInstance";

const AdminAddUserForm = ({ onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    userType: "Operator",
    isActive: true,
    department: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      userType: formData.userType,
      isActive: true,
      department: formData.department,
    };

    try {
      const response = await axios.post("/user-api/user", payload);

      if (response.status === 200 || response.status === 201) {
        onAddUser(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error al agregar usuario:", error);
      if (error.response) {
        const { message } = error.response.data;
        setErrorMessage(
          message || "Error desconocido al guardar el usuario."
        );
      } else {
        setErrorMessage("Error de red: No se pudo conectar al servidor.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Usuario</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ingresar Nombre"
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
              required
              placeholder="Ingresar email"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Teléfono</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Ej: +58 424-1234567"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Tipo de Usuario</label>
            <select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="Operator">Operator</option>
              <option value="Provider">Provider</option>
              <option value="Driver">Driver</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Departamento</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              placeholder="Ingresar nombre del departamento"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddUserForm;