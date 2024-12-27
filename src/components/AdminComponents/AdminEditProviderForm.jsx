import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";

const AdminEditProviderForm = ({ provider, onClose, onSubmit, setErrorMessage }) => {
  const [formData, setFormData] = useState({
    id: provider?.id || null,
    rif: provider?.rif || "",
    providerType: provider?.providerType || "Interno",
    isActive: provider?.isActive || false,
    fleetOfCranes: provider?.fleetOfCranes || [],
    drivers: provider?.drivers || [],
    newCranes: [],
    newDrivers: [],
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
        console.error("Error al obtener datos:", error.message);
      }
    };

    fetchCranesAndDrivers();
  }, []);

  const handleAddCrane = () => {
    if (
      selectedCrane &&
      !formData.newCranes.includes(selectedCrane) &&
      !formData.fleetOfCranes.includes(selectedCrane)
    ) {
      setFormData({
        ...formData,
        newCranes: [...formData.newCranes, selectedCrane],
      });
      setSelectedCrane("");
    }
  };

  const handleRemoveCrane = (craneId) => {
    setFormData({
      ...formData,
      newCranes: formData.newCranes.filter((id) => id !== craneId),
    });
  };

  const handleAddDriver = () => {
    if (
      selectedDriver &&
      !formData.newDrivers.includes(selectedDriver) &&
      !formData.drivers.includes(selectedDriver)
    ) {
      setFormData({
        ...formData,
        newDrivers: [...formData.newDrivers, selectedDriver],
      });
      setSelectedDriver("");
    }
  };

  const handleRemoveDriver = (driverId) => {
    setFormData({
      ...formData,
      newDrivers: formData.newDrivers.filter((id) => id !== driverId),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      fleetOfCranes: formData.newCranes,
      drivers: formData.newDrivers,
      isActive: formData.isActive,
    };

    try {
      console.log("Payload enviado:", updatedData);
      await onSubmit(formData.id, updatedData);
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ocurrió un error al actualizar el proveedor.";
      setErrorMessage(errorMessage);
      console.error("Error al guardar cambios:", errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-screen flex flex-col">
        <div className="px-6 py-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Editar Proveedor</h2>
        </div>
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">RIF</label>
              <input
                type="text"
                value={formData.rif}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Tipo de Proveedor</label>
              <input
                type="text"
                value={formData.providerType}
                disabled
                className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Grúas Asignadas</label>
              <div className="space-y-2">
                {formData.fleetOfCranes.length > 0 ? (
                  formData.fleetOfCranes.map((craneId) => {
                    const crane = availableCranes.find((c) => c.id === craneId);
                    return (
                      <div key={craneId} className="p-2 bg-gray-100 rounded-md shadow-sm">
                        {crane ? `${crane.plate} - ${crane.brand} ${crane.model}` : craneId}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500">No hay grúas registradas para este proveedor.</div>
                )}
              </div>
              <label className="block text-gray-700 font-medium mt-4">Grúas Seleccionadas</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.newCranes.map((craneId) => {
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
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={selectedCrane}
                  onChange={(e) => setSelectedCrane(e.target.value)}
                  className="w-full p-2 border rounded-md"
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
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Conductores Asignados</label>
              <div className="space-y-2">
                {formData.drivers.length > 0 ? (
                  formData.drivers.map((driverId) => {
                    const driver = availableDrivers.find((d) => d.id === driverId);
                    return (
                      <div key={driverId} className="p-2 bg-gray-100 rounded-md shadow-sm">
                        {driver ? driver.dni : driverId}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-gray-500">No hay conductores registrados para este proveedor.</div>
                )}
              </div>
              <label className="block text-gray-700 font-medium mt-4">Conductores Seleccionados</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.newDrivers.map((driverId) => {
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
              <div className="flex items-center gap-2 mt-2">
                <select
                  value={selectedDriver}
                  onChange={(e) => setSelectedDriver(e.target.value)}
                  className="w-full p-2 border rounded-md"
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
            </div>
            <div className="flex justify-end gap-4">
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
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProviderForm;