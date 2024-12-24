import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";

const AdminContractDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [contract, setContract] = useState(null);
  const [policy, setPolicy] = useState(null);
  const [vehicle, setVehicle] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!contract) {
          const contractResponse = await axios.get(`/order-api/contract/${id}`);
          setContract(contractResponse.data);
        }

        if (contract?.insuredVehicle) {
          const vehicleResponse = await axios.get(
            `/order-api/vehicle/${contract.insuredVehicle}`
          );
          setVehicle(vehicleResponse.data);
        }

        if (contract?.associatedPolicy) {
          const policyResponse = await axios.get(
            `/order-api/policy/${contract.associatedPolicy}`
          );
          setPolicy(policyResponse.data);
        }
      } catch (error) {
        console.error("Error al obtener los detalles del contrato:", error);
        setErrorMessage("No se pudieron cargar los detalles del contrato.");
      }
    };

    fetchDetails();
  }, [id, contract]);

  if (!contract) {
    return (
      <div className="flex">
        <AdminNavbar />
        <div className="flex-1 ml-60 p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center">Cargando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Detalle del Contrato
          </h1>
          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
              {errorMessage}
            </div>
          )}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                📝 Información del Contrato
              </h2>
              <p>
                <strong>Fecha de Inicio:</strong> {contract.startDate}
              </p>
              <p>
                <strong>Fecha de Expiración:</strong> {contract.expirationDate}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={
                    contract.status === "Activo"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {contract.status}
                </span>
              </p>
            </div>

            {vehicle && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                  🚗 Información del Vehículo
                </h2>
                <p>
                  <strong>Marca:</strong> {vehicle.brand}
                </p>
                <p>
                  <strong>Modelo:</strong> {vehicle.model}
                </p>
                <p>
                  <strong>Placa:</strong> {vehicle.plate}
                </p>
                <p>
                  <strong>Tamaño del Vehículo:</strong> {vehicle.vehicleSize}
                </p>
                <p>
                  <strong>Año:</strong> {vehicle.year}
                </p>
                <p>
                  <strong>Cliente:</strong> {vehicle.clientName}
                </p>
              </div>
            )}

            {policy && (
              <div className="border-b pb-4">
                <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                  🛡️ Información de la Póliza
                </h2>
                <p>
                  <strong>Tipo:</strong> {policy.type || "No disponible"}
                </p>
                <p>
                  <strong>Kilómetros de Cobertura:</strong> {policy.coverageKm}{" "}
                  km
                </p>
                <p>
                  <strong>Monto de Cobertura:</strong> ${policy.coverageAmount}
                </p>
                <p>
                  <strong>Precio por Kilómetro Extra:</strong> $
                  {policy.priceExtraKm}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  {policy.isActive ? "Activa" : "Inactiva"}
                </p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => navigate(-1)}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContractDetail;
