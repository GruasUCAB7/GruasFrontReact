export const fetchAddressFromCoordinates = async (latitude, longitude, apiKey) => {

  apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API Key is missing.");
    return "No disponible";
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );
    const data = await response.json();
    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return "No disponible";
  } catch (error) {
    console.error("Error al convertir coordenadas:", error);
    return "No disponible";
  }
};
