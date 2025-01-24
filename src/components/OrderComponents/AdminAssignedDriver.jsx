import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";
import { fetchDriversWithDetailsAndDistances } from "../../services/driverService";

const AdminAssignedDriver = ({ orderId, onClose, onDriverAssigned }) => {
  const [driversList, setDriversList] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderResponse = await apiInstance.get(`/order-api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const orderData = orderResponse.data;
        setOrder(orderData);

        if (!orderData || !orderData.incidentAddress) {
          throw new Error("La orden o su dirección de incidente no es válida.");
        }

        const drivers = await fetchDriversWithDetailsAndDistances(orderData, authToken);
        setDriversList(drivers);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setErrorMessage(error.message || "Error al cargar los conductores disponibles.");
      }
    };

    fetchData();
  }, [orderId, authToken]);

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      setErrorMessage("Por favor, selecciona un conductor.");
      return;
    }

    setIsLoading(true);

    try {
      await apiInstance.put(
        `/order-api/order/${orderId}/updateDriverAssigned`,
        { driverAssigned: selectedDriver },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      await apiInstance.patch(
        `/provider-api/driver/${selectedDriver}`,
        { isAvailable: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      onDriverAssigned();
      onClose();
    } catch (error) {
      console.error("Error al asignar conductor:", error);
      setErrorMessage("Error al asignar conductor.");
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
                {`${driver.name} (${driver.dni}) - ${driver.distance.toFixed(2)} km`}
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
