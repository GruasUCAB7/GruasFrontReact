import React, { useState, useEffect } from "react";
import { fetchContractNumber } from "../../services/contractService";

const AdminDetailView = ({ order, onClose }) => {
  const [contractNumber, setContractNumber] = useState("Cargando...");

  useEffect(() => {
    const loadContractNumber = async () => {
      const number = await fetchContractNumber(order.contractClient);
      setContractNumber(number);
    };

    if (order.contractClient) {
      loadContractNumber();
    }
  }, [order.contractClient]);

  if (!order) return null;

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Detalle de la Orden</h2>
        <div className="space-y-4">

          {/* Cliente del Contrato */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Número de Contrato:</span>
            <span className="text-gray-600">{contractNumber}</span>
          </div>

          {/* Dirección del Incidente */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Dirección del Incidente:</span>
            <span className="text-gray-600">{order.incidentAddress || "No disponible"}</span>
          </div>

          {/* Dirección de Destino */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Dirección de Destino:</span>
            <span className="text-gray-600">{order.destinationAddress || "No disponible"}</span>
          </div>

          {/* Tipo de Incidente */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Tipo de Incidente:</span>
            <span className="text-gray-600">{order.incidentType}</span>
          </div>

          {/* Fecha del Incidente */}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Fecha del Incidente:</span>
            <span className="text-gray-600">{formatDate(order.incidentDate)}</span>
          </div>

          {/* Costo Total*/}
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-semibold text-gray-700">Costo Total:</span>
            <span className="text-gray-600">{order.totalCost}</span>
          </div>
        </div>

        {/* Botón para cerrar */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailView;
