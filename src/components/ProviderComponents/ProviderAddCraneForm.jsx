import React, { useState } from "react";
import axios from "../../axiosInstance";

const ProviderAddCraneForm = ({ onClose, onAddCrane, providerId }) => {
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    plate: "",
    craneSize: "",
    year: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const authToken = localStorage.getItem("authToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const createCraneResponse = await axios.post("/provider-api/crane", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      const newCrane = {
        ...createCraneResponse.data,
        isActive: createCraneResponse.data.isActive ?? true,
      };

      const updateProviderPayload = {
        fleetOfCranes: [newCrane.id],
        drivers: [],
      };

      await axios.patch(`/provider-api/provider/${providerId}`, updateProviderPayload, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      onAddCrane(newCrane);
      onClose();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error desconocido al guardar la grúa."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Agregar Grúa</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Marca</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="Ingresar marca"
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
              placeholder="Ingresar modelo"
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
              placeholder="Ingresar placa XX000XX"
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Tamaño</label>
            <select
              name="craneSize"
              value={formData.craneSize}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar tamaño</option>
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
              placeholder="Ingresar año"
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

export default ProviderAddCraneForm;