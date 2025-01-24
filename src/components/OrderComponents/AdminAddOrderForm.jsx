import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const AdminAddOrderForm = ({ operatorId, onClose, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        incidentType: "",
        incidentDate: "",
        incidentAddress: "",
        destinationAddress: "",
        contractClient: "",
    });
    const [driversList, setDriversList] = useState([]);
    const [contractsList, setContractsList] = useState([]);
    const [selectedIncidentLocation, setSelectedIncidentLocation] = useState(null);
    const [selectedDestinationLocation, setSelectedDestinationLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const authToken = localStorage.getItem("authToken");

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    });

    useEffect(() => {
        const fetchDriversWithNames = async () => {
            try {
                const driversResponse = await apiInstance.get("/provider-api/driver", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                const activeDrivers = driversResponse.data.filter((driver) => driver.isActive);

                const driversWithNames = await Promise.all(
                    activeDrivers.map(async (driver) => {
                        try {
                            const userResponse = await apiInstance.get(`/user-api/user/${driver.id}`, {
                                headers: { Authorization: `Bearer ${authToken}` },
                            });
                            return { ...driver, name: userResponse.data.name };
                        } catch (error) {
                            console.error(`Error al obtener datos del usuario con ID: ${driver.id}`, error);
                            return { ...driver, name: "No disponible" };
                        }
                    })
                );

                setDriversList(driversWithNames);
            } catch (error) {
                console.error("Error al cargar los conductores:", error);
                setErrorMessage("Error al cargar los conductores. Intenta nuevamente.");
            }
        };

        const fetchContracts = async () => {
            try {
                const response = await apiInstance.get("/order-api/contract", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setContractsList(response.data);
            } catch (error) {
                console.error("Error al cargar los contratos:", error);
                setErrorMessage("Error al cargar los contratos. Intenta nuevamente.");
            }
        };

        fetchDriversWithNames();
        fetchContracts();
    }, [authToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMapClick = async (e, addressField) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();

        if (addressField === "incidentAddress") {
            setSelectedIncidentLocation({ lat, lng });
        } else if (addressField === "destinationAddress") {
            setSelectedDestinationLocation({ lat, lng });
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            const address = data.results[0]?.formatted_address || "Dirección no disponible";

            setFormData({ ...formData, [addressField]: address });
        } catch (error) {
            console.error("Error al obtener dirección:", error);
            setFormData({ ...formData, [addressField]: "Dirección no disponible" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const newOrder = {
                ContractId: formData.contractClient,
                OperatorId: operatorId,
                IncidentAddress: formData.incidentAddress,
                DestinationAddress: formData.destinationAddress,
                IncidentType: formData.incidentType,
                ExtraServicesApplied: [],
            };

            await apiInstance.post("/order-api/order", newOrder, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            onSubmitSuccess();
            onClose();
        } catch (error) {
            console.error("Error al agregar la orden:", error);
            setErrorMessage("Error al agregar la orden. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Agregar Orden</h2>

                {errorMessage && (
                    <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Tipo de Incidente</label>
                        <select
                            name="incidentType"
                            value={formData.incidentType}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Seleccionar Tipo</option>
                            <option value="Colisión Frontal">Colisión Frontal</option>
                            <option value="Fallo de Frenos">Fallo de Frenos</option>
                            <option value="Rotura del Tren Delantero">Tren Delantero</option>
                            <option value="Falla de Batería">Falla de Batería</option>
                            <option value="Sobrecalentamiento del Motor">Sobrecalentamiento</option>
                            <option value="Fugas de Líquidos">Fugas de Líquidos</option>
                            <option value="Fallas en el Sistema Eléctrico">Falla Sistema Eléctrico</option>
                            <option value="Problemas con las Bujías">Problema con Bujías</option>
                            <option value="Desgaste de Neumáticos">Desgaste de Neumáticos</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Contrato del Cliente</label>
                        <select
                            name="contractClient"
                            value={formData.contractClient}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Seleccionar Contrato</option>
                            {contractsList.map((contract) => (
                                <option key={contract.id} value={contract.id}>
                                    {contract.contractNumber}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Fecha del Incidente</label>
                        <input
                            type="date"
                            name="incidentDate"
                            value={formData.incidentDate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Dirección del Incidente</label>
                        <input
                            type="text"
                            name="incidentAddress"
                            value={formData.incidentAddress}
                            onChange={handleChange}
                            placeholder="Seleccionar Dirección"
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {isLoaded && (
                        <>
                            <div className="h-[300px] w-full mt-4">
                                <GoogleMap
                                    center={selectedIncidentLocation || { lat: 10.4956, lng: -66.9241 }}
                                    zoom={15}
                                    mapContainerClassName="h-full w-full"
                                    onClick={(e) => handleMapClick(e, "incidentAddress")}
                                >
                                    {selectedIncidentLocation && <Marker position={selectedIncidentLocation} />}
                                </GoogleMap>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-gray-700 font-medium">Dirección de Destino</label>
                        <input
                            type="text"
                            name="destinationAddress"
                            value={formData.destinationAddress}
                            onChange={handleChange}
                            placeholder="Seleccionar Dirección"
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    {isLoaded && (
                        <>
                            <div className="h-[300px] w-full mt-4">
                                <GoogleMap
                                    center={selectedDestinationLocation || { lat: 10.4956, lng: -66.9241 }}
                                    zoom={15}
                                    mapContainerClassName="h-full w-full"
                                    onClick={(e) => handleMapClick(e, "destinationAddress")}
                                >
                                    {selectedDestinationLocation && <Marker position={selectedDestinationLocation} />}
                                </GoogleMap>
                            </div>
                        </>
                    )}

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
                            {isLoading ? "Guardando..." : "Guardar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddOrderForm;
