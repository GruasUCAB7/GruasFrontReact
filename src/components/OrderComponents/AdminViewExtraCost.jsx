import React, { useState, useEffect } from "react";
import apiInstance from "../../services/apiService";
import { fetchExtraCostsByOrderId, validatePriceExtraCost } from "../../services/extraCostService";

const AdminViewExtraCost = ({ orderId, onClose }) => {
  const [extraCosts, setExtraCosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchExtraCosts = async () => {
      if (!orderId) {
        setErrorMessage("El ID de la orden no está disponible.");
        return;
      }
  
      setIsLoading(true);
      setErrorMessage("");
  
      try {
        const extraCosts = await fetchExtraCostsByOrderId(orderId);
        setExtraCosts(extraCosts);
      } catch (error) {
        setErrorMessage("Error al obtener los costos extras.");
        console.error("Error al obtener los costos extras:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchExtraCosts();
  }, [orderId]);

  const handleAcceptCosts = async () => {
    setIsLoading(true);
  
    try {
      // Llama a la función del servicio para validar los precios extras
      await validatePriceExtraCost(orderId, extraCosts, true);
      alert("Costos extras aceptados con éxito.");
      onClose(); // Cerrar la vista después de aceptar
    } catch (error) {
      console.error("Error al aceptar los costos extras:", error);
      alert("Error al aceptar los costos extras.");
    } finally {
      setIsLoading(false);
    }
  };


  {/*
  const handleRejectCosts = async () => {
    setIsLoading(true);

    const data = {
      operatorRespose: false,
    };

    try {
      await apiInstance.patch(`/order-api/order/${orderId}/validatePricesExtraCost`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      alert("Costos extras rechazados.");
      onClose(); // Cerrar la vista después de rechazar
    } catch (error) {
      console.error("Error al rechazar los costos extras:", error);
      alert("Error al rechazar los costos extras.");
    } finally {
      setIsLoading(false);
    }
  };*/}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Detalles de los Costos Extras</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        {extraCosts && extraCosts.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left border-b">Nombre</th>
                <th className="px-4 py-2 text-left border-b">Precio</th>
              </tr>
            </thead>
            <tbody>
              {extraCosts.map((cost) => (
                <tr key={cost.id}>
                  <td className="px-4 py-2 border-b">{cost.name}</td>
                  <td className="px-4 py-2 border-b">{cost.price} USD</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay costos extras disponibles para esta orden.</p>
        )}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
          >
            Cerrar
          </button>

          <button
            onClick={handleAcceptCosts}
            disabled={isLoading || extraCosts.length === 0}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
          >
            {isLoading ? "Aceptando..." : "Aceptar Costos Extras"}
          </button>

          <button
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            {isLoading ? "Rechazando..." : "Rechazar Costos Extras"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminViewExtraCost;
