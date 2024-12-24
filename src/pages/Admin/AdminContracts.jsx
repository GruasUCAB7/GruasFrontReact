import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import { useNavigate } from "react-router-dom";

const AdminContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchContracts = async () => {
    try {
      const response = await axios.get("/order-api/contract");

      const contractsData = await Promise.all(
        response.data.map(async (contract) => {
          if (!contract.id) {
            console.error("Contrato sin un ID válido:", contract);
            return null;
          }

          try {
            const vehicleResponse = await axios.get(
              `/order-api/vehicle/${contract.insuredVehicle}`
            );
            const vehicle = vehicleResponse.data;

            return {
              id: contract.id,
              startDate: contract.startDate,
              expirationDate: contract.expirationDate,
              status: contract.status,
              clientName: vehicle.clientName || "N/A",
            };
          } catch (error) {
            console.error(
              `Error al obtener el vehículo para contrato con id ${contract.id}:`,
              error
            );
            return {
              id: contract.id,
              startDate: contract.startDate,
              expirationDate: contract.expirationDate,
              status: contract.status,
              clientName: "N/A",
            };
          }
        })
      );

      const validContracts = contractsData.filter((c) => c !== null);
      setContracts(validContracts);
    } catch (error) {
      console.error("Error al obtener contratos:", error.message);
      setErrorMessage("Error al cargar los contratos. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Consulta de Contratos</h1>
        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-[#00684aff] text-white">
            <tr>
              <th className="px-6 py-3 text-left">Fecha de Inicio</th>
              <th className="px-6 py-3 text-left">Fecha de Expiración</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Cliente</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id} className="border-b">
                <td className="px-6 py-4">{contract.startDate}</td>
                <td className="px-6 py-4">{contract.expirationDate}</td>
                <td
                  className={`px-6 py-4 font-semibold ${
                    contract.status === "Activo"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {contract.status}
                </td>
                <td className="px-6 py-4">{contract.clientName}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => navigate(`/AdminContractDetail/${contract.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminContracts;
