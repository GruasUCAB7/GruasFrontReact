import React, { useState } from "react";

const EditOrderStatusForm = ({ order, onClose, onSave }) => {
  const [status, setStatus] = useState(order.status);
  const [selectedDriver, setSelectedDriver] = useState("");

  const handleSave = () => {
    const updatedOrder = {
      ...order,
      status,
      driver: status === "Pendiente" ? selectedDriver : order.driver,
    };
    onSave(updatedOrder);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-4">Editar Estado de la Orden</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Estado</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {status === "Pendiente" && (
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Seleccionar Conductor</label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar...</option>
              <option value="Conductor 1">Conductor 1</option>
              <option value="Conductor 2">Conductor 2</option>
            </select>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderStatusForm;