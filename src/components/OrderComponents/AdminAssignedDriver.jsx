import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";

const AdminAssignedDriver = ({ orderId, onClose, onDriverAssigned }) => {
  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchDriversWithNames = async () => {
      try {
        const driversResponse = await axios.get("/provider-api/driver", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // Filtrar conductores disponibles
        const availableDrivers = driversResponse.data.filter(
          (driver) => driver.isAvailable
        );

        // Obtener información adicional (nombre) de los usuarios asociados
        const driversWithNames = await Promise.all(
          availableDrivers.map(async (driver) => {
            try {
              const userResponse = await axios.get(`/user-api/user/${driver.userId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              });
              return { ...driver, name: userResponse.data.name }; // Agregar el nombre
            } catch (error) {
              console.error(
                `Error al obtener datos del usuario con ID: ${driver.userId}`,
                error
              );
              return { ...driver, name: "No disponible" }; // Fallback en caso de error
            }
          })
        );

        setDriversList(driversWithNames);
      } catch (error) {
        console.error("Error al cargar los conductores disponibles:", error);
        setErrorMessage("Error al cargar los conductores disponibles.");
      }
    };

    fetchDriversWithNames();
  }, [authToken]);

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      setErrorMessage("Por favor, selecciona un conductor.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      // Actualizar la orden con el conductor asignado
      await axios.put(
        `/order-api/order/${orderId}/updateDriverAssigned`,
        { driverId: selectedDriver },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      // Preguntar
      await axios.patch(
        `/provider-api/driver/${selectedDriver}`,
        { isAvailable: false },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      onDriverAssigned(); // Actualiza la lista de órdenes en `AdminOrders`
      onClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al asignar conductor:", error);
      setErrorMessage("Error al asignar el conductor. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Asignar Conductor</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Selecciona un conductor disponible:
          </label>
          <select
            className="w-full p-2 border rounded-md"
            value={selectedDriver}
            onChange={(e) => setSelectedDriver(e.target.value)}
          >
            <option value="">Seleccionar Conductor</option>
            {driversList.map((driver) => (
              <option key={driver.id} value={driver.id}>
                {`${driver.name} (${driver.dni})`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAssignDriver}
            disabled={isLoading}
            className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
          >
            {isLoading ? "Asignando..." : "Asignar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignedDriver;
