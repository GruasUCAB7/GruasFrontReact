import React, { useState } from "react";
import axios from "../../axiosInstance";

const AdminUpdateUserForm = ({ user, onClose, onUpdateSuccess, onError }) => {
  const [phone, setPhone] = useState(user.phone || "");
  const [status, setStatus] = useState(user.status === "Activo");
  const [department, setDepartment] = useState(user.department || "");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        id: user.id,
        phone: phone || null,
        isActive: status,
        department: department || null,
      };

      await axios.patch(`/user-api/user/${user.id}`, updatedUser);

      onUpdateSuccess({ ...user, phone, status: status ? "Activo" : "Inactivo", department });
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);

      if (error.response) {
        const errorMsg =
          error.response.data?.message || "Hubo un problema al actualizar el usuario.";
        onError(errorMsg);
      } else {
        onError("Error de red: No se pudo conectar al servidor.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Número de Teléfono</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Ingresar teléfono"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value === "true")}
              className="w-full p-2 border rounded-md"
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Departamento</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Ingresar departamento"
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
              className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#00684aff] transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateUserForm;
