import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";

// Función para calcular la distancia entre dos puntos geográficos (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
};

const AdminAssignedDriverAutomatic = ({ orderId, onClose, onDriverAssigned }) => {
  const [driversList, setDriversList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [order, setOrder] = useState(null);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const orderResponse = await apiInstance.get(`/order-api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setOrder(orderResponse.data);
      } catch (error) {
        console.error("Error al cargar los detalles de la orden:", error);
        setErrorMessage("Error al cargar los detalles de la orden.");
      }
    };

    const fetchDriversWithNamesAndDNI = async () => {
      try {
        // Fetch all drivers
        const driversResponse = await apiInstance.get("/provider-api/driver", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const availableDrivers = driversResponse.data.filter(
          (driver) => driver.isAvailable
        );

        // Fetch all users
        const usersResponse = await apiInstance.get("/user-api/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const users = usersResponse.data;

        // Fetch all providers
        const providersResponse = await apiInstance.get("/provider-api/provider", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const providers = providersResponse.data;

        // Map driver data with user data
        const driversWithNamesAndDNI = availableDrivers.map((driver) => {
          const user = users.find((u) => u.id === driver.id); // Match driver.id with user.id
          const provider = providers.find(
            (p) => p._id === driver.providerId // Match provider ID
          );

          return {
            ...driver,
            name: user ? user.name : "No disponible", // Name from users
            dni: driver.dni || "No disponible", // DNI from drivers
            providerType: provider ? provider.providerType : "Desconocido", // Provider type
            providerId: provider ? provider._id : null, // Provider ID for filtering
          };
        });

        // Filter drivers by proximity (ETA), then by provider type
        if (order) {
          // Get the incident's coordinates
          const { latitude: orderLat, longitude: orderLon } = order.incidentAddress;

          // Sort by ETA (distance) and then by provider type
          const sortedDrivers = driversWithNamesAndDNI
            .map((driver) => {
              const { latitude: driverLat, longitude: driverLon } = driver.driverLocation;
              const distance = calculateDistance(orderLat, orderLon, driverLat, driverLon);
              return { ...driver, distance };
            })
            .sort((a, b) => {
              // First, by distance (ETA)
              if (a.distance < b.distance) return -1;
              if (a.distance > b.distance) return 1;

              // Then, by provider type (internal first)
              if (a.providerType === "Interno" && b.providerType !== "Interno") return -1;
              if (a.providerType !== "Interno" && b.providerType === "Interno") return 1;

              return 0;
            });

          setDriversList(sortedDrivers);
        }
      } catch (error) {
        console.error("Error al cargar los conductores disponibles:", error);
        setErrorMessage("Error al cargar los conductores disponibles.");
      }
    };

    fetchOrderDetails();
    fetchDriversWithNamesAndDNI();
  }, [authToken, orderId, order]);

  const handleAssignDriver = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Check if there are available drivers
      if (driversList.length === 0) {
        setErrorMessage("No hay conductores disponibles.");
        return;
      }

      // Get the first available driver
      const firstDriver = driversList[0];
      
      // Assign the first driver to the order
      await apiInstance.put(
        `/order-api/order/${orderId}/updateDriverAssigned`,
        { driverAssigned: firstDriver.id },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      // Update the driver's availability
      await apiInstance.patch(
        `/provider-api/driver/${firstDriver.id}`,
        { isAvailable: false },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      onDriverAssigned();
      onClose();
    } catch (error) {
      console.error("Error al asignar conductor automáticamente:", error);
      setErrorMessage("Error al asignar el conductor automáticamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Asignar Conductor Automáticamente</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

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
            {isLoading ? "Asignando..." : "Asignar Automáticamente"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignedDriverAutomatic;
