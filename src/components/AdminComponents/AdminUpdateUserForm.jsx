import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";

const AdminUpdateUserForm = ({ user, onClose, onUpdateSuccess, onError }) => {
  const [phone, setPhone] = useState(user.phone || "");
  const [status, setStatus] = useState(user.isActive ? "Activo" : "Inactivo");
  const [department, setDepartment] = useState(user.department || "");
  const [passwordExpirationDate, setPasswordExpirationDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (user.passwordExpirationDate) {
      const formattedDate = new Date(user.passwordExpirationDate).toISOString().split("T")[0];
      setPasswordExpirationDate(formattedDate);
    }
  }, [user.passwordExpirationDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!authToken) {
      onError("No se encontró un token de autorización. Inicia sesión nuevamente.");
      setIsLoading(false);
      return;
    }

    try {
      const updatedUser = {
        phone: phone.trim(),
        isActive: status === "Activo",
        department: department.trim(),
        passwordExpirationDate: passwordExpirationDate
          ? new Date(passwordExpirationDate).toISOString()
          : null,
      };

      await apiInstance.patch(`/user-api/user/${user.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      onUpdateSuccess({
        ...user,
        phone,
        status,
        department,
        passwordExpirationDate,
      });
      onClose();
    } catch (error) {
      if (error.response) {
        const errorMsg =
          error.response.data?.message || "Hubo un problema al actualizar el usuario.";
        onError(errorMsg);
      } else if (error.request) {
        onError("Error de red: No se pudo conectar al servidor.");
      } else {
        onError("Error desconocido al configurar la solicitud.");
      }
    } finally {
      setIsLoading(false);
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
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
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

          <div>
            <label className="block text-gray-700 font-medium">
              Fecha de Expiración de Contraseña
            </label>
            <input
              type="date"
              value={passwordExpirationDate}
              onChange={(e) => setPasswordExpirationDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
            {passwordExpirationDate && (
              <p className="text-sm text-gray-500 mt-1">
                Fecha actual: {new Date(passwordExpirationDate).toLocaleDateString("es-VE")}
              </p>
            )}
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
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateUserForm;
