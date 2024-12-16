import React, { useState, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Autocomplete,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";

const AdminAddOrderForm = ({ onClose, onAddOrder }) => {
  const [formData, setFormData] = useState({
    clientId: "",
    dni: "",
    name: "",
    email: "",
    phone: "",
    status: "Pendiente",
    journey: { origin: "", destination: "", directionsResponse: null },
  });

  const [originMarker, setOriginMarker] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [selectingOrigin, setSelectingOrigin] = useState(true); // Flag to know whether we are setting origin or destination.

  const originRef = useRef(null);
  const destinationRef = useRef(null);
  const geocoderRef = useRef(null);

  const initializeGeocoder = () => {
    if (!geocoderRef.current && window.google && window.google.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }
  };

  const getAddressFromCoords = (lat, lng, isOrigin) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const address = results[0].formatted_address;
        if (isOrigin) {
          setFormData((prevState) => ({
            ...prevState,
            journey: { ...prevState.journey, origin: address },
          }));
        } else {
          setFormData((prevState) => ({
            ...prevState,
            journey: { ...prevState.journey, destination: address },
          }));
        }
      }
    });
  };

  const handleMapClick = (event) => {
    const latLng = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    if (selectingOrigin) {
      setOriginMarker(latLng);
      getAddressFromCoords(latLng.lat, latLng.lng, true);
      setSelectingOrigin(false); // Move to destination selection
    } else {
      setDestinationMarker(latLng);
      getAddressFromCoords(latLng.lat, latLng.lng, false);
      setSelectingOrigin(true); // Reset for the next input
    }

    calculateRoute(latLng, selectingOrigin ? destinationMarker : originMarker);
  };

  const calculateRoute = (updatedMarker, otherMarker) => {
    if (!updatedMarker || !otherMarker) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: originMarker || updatedMarker,
        destination: destinationMarker || updatedMarker,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirectionsResponse(result);
          setFormData((prevState) => ({
            ...prevState,
            journey: { ...prevState.journey, directionsResponse: result },
          }));
        }
      }
    );
  };

  const handleSubmit = () => {
    onAddOrder(formData);
    onClose();
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places"]}
      onLoad={initializeGeocoder}
    >
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl h-[80%] overflow-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Agregar Orden</h2>
          <div className="space-y-4">
            {/* Input Fields */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Nombre del cliente"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
              placeholder="DNI del cliente"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Email del cliente"
              className="w-full p-2 border rounded-md"
            />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Teléfono del cliente"
              className="w-full p-2 border rounded-md"
            />

            {/* Map Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Origen"
                value={formData.journey.origin}
                readOnly
                className="w-full p-2 border rounded-md"
              />
              <input
                type="text"
                placeholder="Destino"
                value={formData.journey.destination}
                readOnly
                className="w-full p-2 border rounded-md"
              />
            </div>

            {/* Map */}
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "300px" }}
              center={{ lat: 10.48801, lng: -66.87919 }}
              zoom={12}
              onClick={(e) => handleMapClick(e)}
            >
              {originMarker && <Marker position={originMarker} />}
              {destinationMarker && <Marker position={destinationMarker} />}
              {directionsResponse && (
                <DirectionsRenderer directions={directionsResponse} />
              )}
            </GoogleMap>
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Guardar Orden
            </button>
          </div>
        </div>
      </div>
    </LoadScript>
  );
};

export default AdminAddOrderForm;
