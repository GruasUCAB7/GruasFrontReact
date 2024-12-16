import React, { useState } from "react";
import axios from "../../axiosInstance";

const AdminUpdateUserForm = ({ user, onClose, onUpdateSuccess, onError }) => {
  const [phone, setPhone] = useState(user.phone || "");
  const [status, setStatus] = useState(user.status === "Activo");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = {
        id: user.id,
        phone: phone || null,
        isActive: status,
      };

      await axios.patch(`/user-api/user/${user.id}`, updatedUser);

      onUpdateSuccess({ ...user, phone, status: status ? "Activo" : "Inactivo" });
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      onError("Hubo un problema al actualizar el usuario. Revisa los datos ingresados.");
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
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
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
