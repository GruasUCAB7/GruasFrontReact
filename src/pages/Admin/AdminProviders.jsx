import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddProviderForm from "../../components/AdminComponents/AdminAddProviderForm";
import AdminEditProviderForm from "../../components/AdminComponents/AdminEditProviderForm";

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterProviderType, setFilterProviderType] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
      const role = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUserRole(role);

      if (!["Admin", "Operator", "Provider"].includes(role)) {
        console.error("Acceso denegado: Rol no autorizado.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchProviders = useCallback(async () => {
    try {
      const response = await axios.get("/provider-api/provider", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "application/json",
        },
      });
      const formattedProviders = response.data.map((provider) => ({
        id: provider.id,
        rif: provider.rif,
        providerType: provider.providerType,
        fleetOfCranes: provider.fleetOfCranes || [],
        drivers: provider.drivers || [],
        isActive: provider.isActive,
      }));
      setProviders(formattedProviders);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error al cargar la lista de proveedores. Intenta nuevamente.");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const handleAddProvider = async () => {
    try {
      await fetchProviders();
      setSuccessMessage("¡Proveedor agregado exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al agregar proveedor:", error.message);
    }
  };

  const handleEditProvider = async () => {
    try {
      await fetchProviders();
      setSuccessMessage("¡Proveedor actualizado exitosamente!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error al editar proveedor:", error.message);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearchTerm =
      searchTerm === "" || provider.rif.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      filterState === "" || (provider.isActive ? "Activo" : "Inactivo") === filterState;

    const matchesProviderType =
      filterProviderType === "" || provider.providerType === filterProviderType;

    return matchesSearchTerm && matchesState && matchesProviderType;
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

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />

      <div className="flex-1 pl-30 p-8 bg-gray-100 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta y administra los proveedores registrados.
          </p>
        </div>

        {successMessage && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md animate-bounce">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
            {errorMessage}
          </div>
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por RIF"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />

          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Estado (Todos)</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <select
            value={filterProviderType}
            onChange={(e) => setFilterProviderType(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Tipo de Proveedor (Todos)</option>
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
          </select>

          <button
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Proveedor
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">RIF</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tipo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Grúas</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Conductores</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.rif}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.providerType}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.fleetOfCranes.length}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.drivers.length}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${provider.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {provider.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowEditForm(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <AdminAddProviderForm
            onClose={() => setShowAddForm(false)}
            onSubmitSuccess={() => {
              handleAddProvider(); // Refrescar la lista de proveedores
            }}
          />
        )}
        {showEditForm && selectedProvider && (
          <AdminEditProviderForm
            provider={selectedProvider}
            onClose={() => setShowEditForm(false)}
            onSubmit={handleEditProvider}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProviders;
