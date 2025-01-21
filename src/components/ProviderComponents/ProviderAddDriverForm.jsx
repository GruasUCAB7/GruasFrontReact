import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";
import "../../index.css";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const ProviderAddDriverForm = ({ onClose, onAddDriver, providerId }) => {
  const [formData, setFormData] = useState({
    userId: "",
    dni: "",
    isActiveLicensed: true,
    craneAssigned: "",
    driverLocation: "",
    licenseImage: null,
    dniImage: null,
    roadMedicalCertificateImage: null,
    civilLiabilityImage: null,
    isActive: true,
    isAvailable: true,
  });

  const [driversList, setDriversList] = useState([]);
  const [cranesList, setCranesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const providerResponse = await apiInstance.get(
          `/provider-api/provider/${providerId}`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const assignedDriverIds = providerResponse.data.drivers || [];
        const fleetOfCranes = providerResponse.data.fleetOfCranes || [];

        const usersResponse = await apiInstance.get("/user-api/user", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const filteredDrivers = usersResponse.data.filter(
          (user) =>
            user.userType === "Driver" &&
            user.isActive &&
            !assignedDriverIds.includes(user.id)
        );

        setDriversList(filteredDrivers);

        const assignedCraneIds = new Set();

        for (const driverId of assignedDriverIds) {
          const driverResponse = await apiInstance.get(`/provider-api/driver/${driverId}`, {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          if (driverResponse.data.craneAssigned) {
            assignedCraneIds.add(driverResponse.data.craneAssigned);
          }
        }

        const craneDetails = await Promise.all(
          fleetOfCranes.map(async (craneId) => {
            try {
              const craneResponse = await apiInstance.get(`/provider-api/crane/${craneId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              });
              return craneResponse.data;
            } catch (error) {
              return null;
            }
          })
        );

        const availableCranes = Array.from(
          new Map(
            craneDetails
              .filter((crane) => crane && !assignedCraneIds.has(crane.id))
              .map((crane) => [crane.id, crane])
          ).values()
        );

        setCranesList(availableCranes);
      } catch (error) {
        setErrorMessage("Error al cargar los datos. Intente nuevamente.");
      }
    };

    fetchData();
  }, [authToken, providerId]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({ ...formData, [name]: type === "file" ? files[0] : value });
  };

  const handleMapClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    setSelectedLocation({ lat, lng });

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      const address = data.results[0]?.formatted_address;

      if (address) {
        setFormData({ ...formData, driverLocation: address });
      } else {
        setFormData({ ...formData, driverLocation: "Dirección no disponible" });
      }
    } catch (error) {
      setFormData({ ...formData, driverLocation: "Dirección no disponible" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) formDataToSend.append(key, value);
    });

    try {
      const createDriverResponse = await apiInstance.post(
        "/provider-api/driver",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const newDriver = createDriverResponse.data;

      const updateProviderResponse = await apiInstance.patch(
        `/provider-api/provider/${providerId}`,
        { drivers: [newDriver.id] },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (updateProviderResponse.status === 200) {
        onAddDriver(newDriver);
        onClose();
      } else {
        throw new Error("Error al asignar el conductor al proveedor.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error desconocido al guardar el conductor."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg scrollable">
        <h2 className="text-2xl font-bold mb-4">Agregar Conductor</h2>
        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Usuario Conductor</label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Seleccionar Usuario Conductor</option>
                {driversList.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {`${driver.name} (${driver.email})`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium">DNI</label>
              <input
                type="text"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                required
                placeholder="Ingresar DNI"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Grúa Asignada</label>
              <select
                name="craneAssigned"
                value={formData.craneAssigned}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-md"
              >
                <option value="">Seleccionar Grúa</option>
                {cranesList.map((crane) => (
                  <option key={crane.id} value={crane.id}>
                    {`${crane.brand} ${crane.model} (${crane.plate})`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Ubicación del Conductor</label>
            <input
              type="text"
              name="driverLocation"
              value={formData.driverLocation}
              onChange={handleChange}
              required
              placeholder="Seleccionar Dirección"
              className="w-full p-2 border rounded-md"
            />
          </div>
          {isLoaded && (
            <div className="h-[300px] w-full mt-4">
              <GoogleMap
                center={selectedLocation || { lat: 10.4956, lng: -66.9241 }}
                zoom={15}
                mapContainerClassName="h-full w-full"
                onClick={handleMapClick}
              >
                {selectedLocation && <Marker position={selectedLocation} />}
              </GoogleMap>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-gray-700 font-medium">Licencia</label>
              <input
                type="file"
                name="licenseImage"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Documento de Identidad</label>
              <input
                type="file"
                name="dniImage"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Certificado Médico</label>
              <input
                type="file"
                name="roadMedicalCertificateImage"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Responsabilidad Civil</label>
              <input
                type="file"
                name="civilLiabilityImage"
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 space-x-4">
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
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderAddDriverForm;