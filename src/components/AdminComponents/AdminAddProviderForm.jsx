import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";

const AdminAddProviderForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    rif: "",
    providerType: "Interno",
    fleetOfCranes: [],
    drivers: [],
  });

  const [availableCranes, setAvailableCranes] = useState([]);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedCrane, setSelectedCrane] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    const fetchCranesAndDrivers = async () => {
      try {
        const cranesResponse = await axios.get("/provider-api/crane");
        setAvailableCranes(cranesResponse.data);
        const driversResponse = await axios.get("/provider-api/driver");
        setAvailableDrivers(driversResponse.data);
      } catch (error) {
        console.error("Error fetching cranes or drivers:", error.message);
      }
    };
    fetchCranesAndDrivers();
  }, []);

  const handleAddCrane = () => {
    if (selectedCrane && !formData.fleetOfCranes.includes(selectedCrane)) {
      setFormData({
        ...formData,
        fleetOfCranes: [...formData.fleetOfCranes, selectedCrane],
      });
      setSelectedCrane("");
    }
  };

  const handleAddDriver = () => {
    if (selectedDriver && !formData.drivers.includes(selectedDriver)) {
      setFormData({
        ...formData,
        drivers: [...formData.drivers, selectedDriver],
      });
      setSelectedDriver("");
    }
  };

  const handleRemoveCrane = (craneId) => {
    setFormData({
      ...formData,
      fleetOfCranes: formData.fleetOfCranes.filter((id) => id !== craneId),
    });
  };

  const handleRemoveDriver = (driverId) => {
    setFormData({
      ...formData,
      drivers: formData.drivers.filter((id) => id !== driverId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Proveedor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">RIF</label>
            <input
              type="text"
              name="rif"
              value={formData.rif}
              onChange={(e) => setFormData({ ...formData, rif: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Tipo de Proveedor</label>
            <select
              name="providerType"
              value={formData.providerType}
              onChange={(e) => setFormData({ ...formData, providerType: e.target.value })}
              className="w-full p-2 border rounded-md"
            >
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Grúas</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedCrane}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setSelectedCrane(e.target.value)}
              >
                <option value="">Selecciona una grúa</option>
                {availableCranes.map((crane) => (
                  <option key={crane.id} value={crane.id}>
                    {crane.plate} - {crane.brand} {crane.model}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddCrane}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.fleetOfCranes.map((craneId) => {
                const crane = availableCranes.find((c) => c.id === craneId);
                return (
                  <span
                    key={craneId}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {crane ? `${crane.plate} - ${crane.brand}` : craneId}
                    <button
                      type="button"
                      onClick={() => handleRemoveCrane(craneId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Conductores</label>
            <div className="flex items-center gap-2">
              <select
                value={selectedDriver}
                className="w-full p-2 border rounded-md"
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Selecciona un conductor</option>
                {availableDrivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.dni}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddDriver}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
              >
                Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.drivers.map((driverId) => {
                const driver = availableDrivers.find((d) => d.id === driverId);
                return (
                  <span
                    key={driverId}
                    className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {driver ? driver.dni : driverId}
                    <button
                      type="button"
                      onClick={() => handleRemoveDriver(driverId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      &times;
                    </button>
                  </span>
                );
              })}
            </div>
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
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProviderForm;