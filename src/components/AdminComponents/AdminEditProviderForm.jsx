import React, { useState } from "react";
import apiInstance from "../../services/apiService";
import NotificationCard from "../Notification/NotificationCard";

const AdminEditProviderForm = ({ provider, onClose, onSubmit, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    id: provider?.id || null,
    rif: provider?.rif || "",
    providerType: provider?.providerType || "Interno",
    isActive: provider?.isActive || false,
  });

  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      isActive: formData.isActive,
    };

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        showNotification("Error de autenticación. Por favor, inicia sesión nuevamente.", "error");
        return;
      }

      await apiInstance.patch(`/provider-api/provider/${formData.id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      showNotification("Proveedor actualizado exitosamente.", "success");
      onUpdateSuccess();
      onClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error al actualizar el proveedor.";
      showNotification(errorMessage, "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Editar Proveedor</h2>
        </div>
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">RIF</label>
              <input
                type="text"
                value={formData.rif}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Tipo de Proveedor</label>
              <input
                type="text"
                value={formData.providerType}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Estado</label>
              <select
                value={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.value === "true" })
                }
                className="w-full p-2 border rounded-md"
              >
                <option value={true}>Activo</option>
                <option value={false}>Inactivo</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
        {notification.visible && (
          <NotificationCard
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </div>
    </div>
  );
};

export default AdminEditProviderForm;
