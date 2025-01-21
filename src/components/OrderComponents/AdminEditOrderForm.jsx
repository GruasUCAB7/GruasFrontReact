import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";

const AdminEditOrderForm = ({ order, onClose, onSubmitSuccess }) => {
    const [formData, setFormData] = useState({
        incidentType: "",
        incidentDate: "",
        totalCost: 0,
        incidentAddress: "",
        destinationAddress: "",
        driverAssigned: "",
        contractClient: "",
    });
    const [driversList, setDriversList] = useState([]);
    const [contractsList, setContractsList] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const authToken = localStorage.getItem("authToken");
    if (authToken) {
        const payload = JSON.parse(atob(authToken.split(".")[1]));
        console.log("Payload del token:", payload);
    } else {
        console.error("Token no encontrado en localStorage");
    }

    useEffect(() => {
        if (order) {
            setFormData({
                incidentType: order.incidentType || "",
                incidentDate: order.incidentDate || "",
                totalCost: order.totalCost || 0,
                incidentAddress: order.incidentAddress || "",
                destinationAddress: order.destinationAddress || "",
                driverAssigned: order.driverAssigned || "",
                contractClient: order.contractClient || "",
            });
        }

        const fetchDriversAndContracts = async () => {
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
                            return { ...driver, name: "No disponible" };
                        }
                    })
                );

                setDriversList(driversWithNames);

                const contractsResponse = await apiInstance.get("/order-api/order/contract", {
                    headers: { Authorization: `Bearer ${authToken}` },
                });

                setContractsList(contractsResponse.data);
            } catch (error) {
                setErrorMessage("Error al cargar datos iniciales. Intenta nuevamente.");
            }
        };

        fetchDriversAndContracts();
    }, [authToken, order]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            await apiInstance.patch(`/order-api/order/${order.id}`, formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            onSubmitSuccess();
            onClose();
        } catch (error) {
            setErrorMessage("Error al editar la orden. Intenta nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Editar Orden</h2>

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
                            <option value="ColisionFrontal">Colisión Frontal</option>
                            <option value="FalloFrenos">Fallo de Frenos</option>
                            <option value="TrenDelantero">Tren Delantero</option>
                            <option value="FallaBateria">Falla de Batería</option>
                            <option value="Sobrecalentamiento">Sobrecalentamiento</option>
                            <option value="FugasLiquidos">Fugas de Líquidos</option>
                            <option value="FallaSistemaElectrico">Falla Sistema Eléctrico</option>
                            <option value="ProblemaBujias">Problema con Bujías</option>
                            <option value="DesgasteNeumaticos">Desgaste de Neumáticos</option>
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
                        <label className="block text-gray-700 font-medium">Costo Total</label>
                        <input
                            type="number"
                            name="totalCost"
                            value={formData.totalCost}
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
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Dirección de Destino</label>
                        <input
                            type="text"
                            name="destinationAddress"
                            value={formData.destinationAddress}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Conductor Asignado</label>
                        <select
                            name="driverAssigned"
                            value={formData.driverAssigned}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">Por asignar</option>
                            {driversList.map((driver) => (
                                <option key={driver.id} value={driver.id}>
                                    {`${driver.name} (${driver.dni})`}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Número de Contrato</label>
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

export default AdminEditOrderForm;
