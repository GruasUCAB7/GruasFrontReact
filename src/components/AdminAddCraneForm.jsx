import React, { useState } from "react";

const AdminAddCraneForm = ({ crane, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    id: crane?.id || null,
    brand: crane?.brand || "",
    model: crane?.model || "",
    plate: crane?.plate || "",
    type: crane?.type || "Ligera",
    year: crane?.year || "",
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
          {crane ? "Editar Grúa" : "Agregar Grúa"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Marca</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Modelo</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Placa</label>
            <input
              type="text"
              name="plate"
              value={formData.plate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tipo</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="Ligera">Ligera</option>
              <option value="Mediana">Mediana</option>
              <option value="Pesada">Pesada</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Año</label>
            <input
              type="number"
              name="year"
              value={formData.year}
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
              {crane ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddCraneForm;
