import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiInstance from "../../services/apiService";
import NotificationCard from "../Notification/NotificationCard";

const AdminAddProviderForm = ({ onClose, onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    userId: "",
    rif: "",
    providerType: "Interno",
    status: "Activo",
  });

  const [availableProviders, setAvailableProviders] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, visible: false });
    }, 3000);
  };

  useEffect(() => {
    const fetchAvailableProviders = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          showNotification("Error de autenticación. Por favor, inicia sesión nuevamente.", "error");
          return;
        }

        const providerResponse = await apiInstance.get("/provider-api/provider", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const registeredProviderIds = providerResponse.data.map((provider) => provider.id);

        const usersResponse = await apiInstance.get("/user-api/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const filteredProviders = usersResponse.data.filter(
          (user) =>
            user.userType === "Provider" && 
            user.isActive && 
            !registeredProviderIds.includes(user.id) 
        );

        setAvailableProviders(filteredProviders);
        setIsLoading(false);
      } catch (error) {
        showNotification("Error al cargar los usuarios disponibles. Intenta nuevamente.", "error");
        setIsLoading(false);
      }
    };

    fetchAvailableProviders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        showNotification("Error de autenticación. Por favor, inicia sesión nuevamente.", "error");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        userId: formData.userId,
        rif: formData.rif,
        providerType: formData.providerType,
        fleetOfCranes: [],
        drivers: [],
      };

      const response = await apiInstance.post(
        "/provider-api/provider",
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        showNotification("¡Proveedor agregado exitosamente!", "success");
        onSubmitSuccess(response.data);
        onClose();
      }
    } catch (error) {
      showNotification("Error al agregar el proveedor. Intenta nuevamente.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-bold text-gray-800">Cargando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Proveedor</h2>

        {/* NotificationCard */}
        {notification.visible && (
          <NotificationCard
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Usuario</label>
            <select
              name="userId"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="">Selecciona un usuario</option>
              {availableProviders.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email} - {user.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">RIF</label>
            <input
              type="text"
              name="rif"
              value={formData.rif}
              onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
              className="w-full p-2 border rounded-md"
              placeholder="Ingrese el RIF del proveedor"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tipo de Proveedor</label>
            <select
              name="providerType"
              value={formData.providerType}
              onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Guardando..." : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProviderForm;
