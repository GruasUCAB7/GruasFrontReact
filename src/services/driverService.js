import apiInstance from "./apiService";
import { fetchUserName } from "./userService";


export const fetchDriversWithDetailsAndDistances = async (order, authToken) => {
  try {
    if (!order || !order.incidentAddress) {
      throw new Error("La orden o su dirección de incidente no es válida.");
    }

    // Obtener conductores disponibles
    const response = await apiInstance.get("/provider-api/provider/availables", {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const availableDrivers = response.data;

    // Procesar los conductores
    const driversWithDetails = await Promise.all(
      availableDrivers.map(async (driver) => {
        try {
          // Obtener nombre del conductor
          const userName = await fetchUserName(driver.id);

          // Obtener detalles adicionales del conductor desde su endpoint específico
          const driverDetailsResponse = await apiInstance.get(
            `/provider-api/driver/${driver.id}`,
            {
              headers: { Authorization: `Bearer ${authToken}` },
            }
          );

          const driverDetails = driverDetailsResponse.data;
          const location = driverDetails.driverLocation;
          const dni = driverDetails.dni;

          if (!location || !location.latitude || !location.longitude) {
            throw new Error(`El conductor ${driver.id} no tiene ubicación disponible.`);
          }

          // Calcular la distancia entre el incidente y el conductor
          const distance = calculateETA(order.incidentAddress, location);

          return {
            id: driver.id,
            name: userName,
            dni, // Agregar el DNI del conductor
            location,
            distance,
          };
        } catch (error) {
          console.error(`Error al procesar el conductor ${driver.id}:`, error);
          throw new Error("Error al obtener detalles del conductor.");
        }
      })
    );

    // Ordenar conductores por distancia (más cercano primero)
    return driversWithDetails.sort((a, b) => a.distance - b.distance);
  } catch (error) {
    console.error("Error al obtener conductores disponibles:", error);
    throw new Error("No se pudieron cargar los conductores disponibles.");
  }
};

// Calcular distancia entre dos ubicaciones (sin cambios)
const calculateETA = (incidentLocation, driverLocation) => {
  if (!incidentLocation || !driverLocation) {
    console.error("Ubicaciones inválidas para el cálculo de distancia:", {
      incidentLocation,
      driverLocation,
    });
    return Infinity; // Retornar un valor alto si las ubicaciones son inválidas
  }

  const lat1 = incidentLocation.latitude;
  const lon1 = incidentLocation.longitude;
  const lat2 = driverLocation.latitude;
  const lon2 = driverLocation.longitude;

  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en km
};
