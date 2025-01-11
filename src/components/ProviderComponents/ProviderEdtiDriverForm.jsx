import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";

const ProviderEditDriverForm = ({ driver, onClose, onUpdateSuccess, providerId }) => {
  const [isActiveLicensed, setIsActiveLicensed] = useState(driver?.isActiveLicensed || false);
  const [craneAssigned, setCraneAssigned] = useState(driver?.craneAssigned || "");
  const [isAvailable, setIsAvailable] = useState(driver?.isAvailable || false);
  const [isActive, setIsActive] = useState(driver?.isActive || true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cranesList, setCranesList] = useState([]);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!providerId || !driver?.id) {
      return;
    }

    const fetchCranes = async () => {
      try {
        const providerResponse = await axios.get(`/provider-api/provider/${providerId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const fleetOfCranes = providerResponse.data.fleetOfCranes || [];
        const assignedDriverIds = providerResponse.data.drivers || [];
        const assignedCraneIds = new Set();

        for (const driverId of assignedDriverIds) {
          const driverResponse = await axios.get(`/provider-api/driver/${driverId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });
          if (driverResponse.data.craneAssigned) {
            assignedCraneIds.add(driverResponse.data.craneAssigned);
          }
        }

        const craneDetails = await Promise.all(
          fleetOfCranes.map(async (craneId) => {
            try {
              const craneResponse = await axios.get(`/provider-api/crane/${craneId}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });
              return craneResponse.data;
            } catch (error) {
              return null;
            }
          })
        );

        const availableCranes = craneDetails
          .filter((crane) => crane && (!assignedCraneIds.has(crane.id) || crane.id === craneAssigned))
          .reduce((unique, crane) => {
            if (!unique.some((item) => item.id === crane.id)) {
              unique.push(crane);
            }
            return unique;
          }, []);

        setCranesList(availableCranes.map((crane) => ({
          id: crane.id,
          label: `${crane.brand} (${crane.plate})`,
        })));
      } catch (error) {
        setErrorMessage("Error al cargar las grúas. Intente nuevamente.");
      }
    };

    fetchCranes();
  }, [authToken, providerId, craneAssigned, driver]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.patch(
        `/provider-api/driver/${driver.id}`,
        {
          isActiveLicensed,
          craneAssigned,
          isAvailable,
          isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const updatedDriver = {
          ...driver,
          isActiveLicensed,
          craneAssigned,
          isAvailable,
          isActive,
        };

        onUpdateSuccess(updatedDriver);
        onClose();
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error desconocido al actualizar el conductor."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Editar Conductor</h2>

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Licencia Activa</label>
            <select
              value={isActiveLicensed}
              onChange={(e) => setIsActiveLicensed(e.target.value === "true")}
              className="w-full p-2 border rounded-md"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Grúa Asignada</label>
            <select
              value={craneAssigned}
              onChange={(e) => setCraneAssigned(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Sin asignar</option>
              {cranesList.map((crane) => (
                <option key={crane.id} value={crane.id}>
                  {crane.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Disponible</label>
            <select
              value={isAvailable}
              onChange={(e) => setIsAvailable(e.target.value === "true")}
              className="w-full p-2 border rounded-md"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Activo</label>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full p-2 border rounded-md"
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
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
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProviderEditDriverForm;
