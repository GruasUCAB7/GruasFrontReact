import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import { useNavigate } from "react-router-dom";

const AdminContracts = () => {
  const [contracts, setContracts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
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

  const filteredContracts = contracts.filter((contract) => {
    const matchesSearchTerm =
      searchTerm === "" ||
      contract.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      filterState === "" || contract.status === filterState;

    return matchesSearchTerm && matchesState;
  });

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Consulta de Contratos</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta los contratos registrados.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por Cliente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          />
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Estado (Todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
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
            {filteredContracts.map((contract) => (
              <tr key={contract.id} className="border-b">
                <td className="px-6 py-4">{contract.startDate}</td>
                <td className="px-6 py-4">{contract.expirationDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium ${contract.status === "Activo"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {contract.status}
                  </span>
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
