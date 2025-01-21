import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiInstance from "../../services/apiService";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import ProviderAddDriverForm from "../../components/ProviderComponents/ProviderAddDriverForm";
import ProviderEditDriverForm from "../../components/ProviderComponents/ProviderEdtiDriverForm";
import DriverDocumentGallery from "../../components/ProviderComponents/DriverDocumentGallery";

const ProviderDrivers = () => {
  const { id } = useParams();
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [cranesMap, setCranesMap] = useState(new Map());
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
      setUserRole(
        tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );

      if (tokenPayload.exp * 1000 < Date.now()) {
        localStorage.removeItem("authToken");
        navigate("/login");
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }
  }, [navigate]);

  const fetchDrivers = useCallback(async () => {
    try {
      const response = await apiInstance.get(`/provider-api/provider/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const tempCranesMap = new Map();

      const driverData = await Promise.all(
        response.data.drivers.map(async (driverId) => {
          try {
            const driverResponse = await apiInstance.get(`/provider-api/driver/${driverId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
            const driver = driverResponse.data;

            if (driver.craneAssigned && !tempCranesMap.has(driver.craneAssigned)) {
              const craneResponse = await apiInstance.get(`/provider-api/crane/${driver.craneAssigned}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              });
              tempCranesMap.set(driver.craneAssigned, craneResponse.data);
            }

            return driver;
          } catch (error) {
            return null;
          }
        })
      );

      const uniqueDrivers = driverData.filter(Boolean).reduce((acc, driver) => {
        if (!acc.some((d) => d.id === driver.id)) {
          acc.push(driver);
        }
        return acc;
      }, []);

      setDrivers(uniqueDrivers);
      setCranesMap(tempCranesMap);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error al cargar los conductores. Intenta nuevamente.");
      setLoading(false);
    }
  }, [id]);

  const handleViewDocuments = (driver) => {
    const documents = driver.imagesDocuments || [];
    setSelectedDocuments(documents);
    setShowImageGallery(true);
  };

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleAddDriver = async (newDriver) => {

    const driverResponse = await apiInstance.get(`/provider-api/driver/${newDriver.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    const completeDriver = driverResponse.data;

    setDrivers((prevDrivers) => {
      if (!prevDrivers.some((driver) => driver.id === completeDriver.id)) {
        return [...prevDrivers, completeDriver];
      }
      return prevDrivers;
    });

    setSuccessMessage("¡Conductor agregado exitosamente!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleUpdateDriver = (updatedDriver) => {
    setDrivers((prevDrivers) =>
      prevDrivers.map((driver) =>
        driver.id === updatedDriver.id ? { ...driver, ...updatedDriver } : driver
      )
    );

    if (updatedDriver.craneAssigned) {
      apiInstance
        .get(`/provider-api/crane/${updatedDriver.craneAssigned}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        })
        .then((response) => {
          setCranesMap((prevMap) => new Map(prevMap).set(updatedDriver.craneAssigned, response.data));
        });
    }
    setSuccessMessage("¡Conductor actualizado exitosamente!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearchTerm =
      (driver.dni?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (driver.craneAssigned?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilterStatus =
      filterStatus === "" || driver.isActiveLicensed === (filterStatus === "Licenciado");

    return matchesSearchTerm && matchesFilterStatus;
  });

  if (loading) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Cargando datos...</h1>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-600">{errorMessage}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />
      <div className="flex-1 ml-30 p-8 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Conductores del Proveedor</h1>
        
        {successMessage && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md animate-bounce">
            {successMessage}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por DNI o grúa asignada"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="Licenciado">Licenciado</option>
            <option value="No Licenciado">No Licenciado</option>
          </select>

          <button
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Conductor
          </button>
        </div>

        {filteredDrivers.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">DNI</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Licencia Activa</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Grúa Asignada</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Disponible</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.dni}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${driver.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {driver.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${driver.isActiveLicensed
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {driver.isActiveLicensed ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {cranesMap.get(driver.craneAssigned)
                      ? `${cranesMap.get(driver.craneAssigned).brand} (${cranesMap.get(driver.craneAssigned).plate})`
                      : "Sin asignar"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${driver.isAvailable
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {driver.isAvailable ? "Disponible" : "No disponible"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleViewDocuments(driver)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3 0h10.5m-10.5 0A2.25 2.25 0 013 11.25v7.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75v-7.5A2.25 2.25 0 0018.75 9m-13.5 0V5.25"
                          />
                        </svg>
                        <span>Ver Documentos</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowEditForm(true);
                        }}
                        className="flex items-center gap-2 bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.232 5.232a3 3 0 114.243 4.243L9.243 19.707a1 1 0 01-.487.272l-3 1a1 1 0 01-1.262-1.262l1-3a1 1 0 01.272-.487l10.243-10.243z"
                          />
                        </svg>
                        <span>Editar</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700">No hay conductores registrados para este proveedor.</p>
        )}
        {showImageGallery && selectedDocuments.length > 0 && (
          <DriverDocumentGallery
            documents={selectedDocuments}
            onClose={() => setShowImageGallery(false)}
          />
        )}
        {showAddForm && (
          <ProviderAddDriverForm
            onClose={() => setShowAddForm(false)}
            onAddDriver={handleAddDriver}
            providerId={id}
          />
        )}
        {showEditForm && selectedDriver && (
          <ProviderEditDriverForm
            driver={selectedDriver}
            providerId={id}
            onClose={() => setShowEditForm(false)}
            onUpdateSuccess={handleUpdateDriver}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderDrivers;