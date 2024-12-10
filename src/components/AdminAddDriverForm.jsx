import React, { useState } from "react";

const AdminAddDriverForm = ({ driver, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: driver?.id || null,
    dni: driver?.dni || "",
    licenseStatus: driver?.licenseStatus || "Activa",
    craneId: driver?.craneId || "",
    driverStatus: driver?.driverStatus || "Activo",
    creationDate: driver?.creationDate || new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {driver ? "Editar Conductor" : "Agregar Conductor"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Estatus de Licencia
            </label>
            <select
              name="licenseStatus"
              value={formData.licenseStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">ID Grúa</label>
            <input
              type="text"
              name="craneId"
              value={formData.craneId}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Estatus del Conductor
            </label>
            <select
              name="driverStatus"
              value={formData.driverStatus}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Fecha de Creación
            </label>
            <input
              type="date"
              name="creationDate"
              value={formData.creationDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
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
              className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
            >
              {driver ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddDriverForm;
