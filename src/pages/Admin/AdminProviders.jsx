import React, { useState, useEffect } from "react";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddProviderForm from "../../components/AdminComponents/AdminAddProviderForm";
import AdminEditProviderForm from "../../components/AdminComponents/AdminEditProviderForm";
import { useNavigate } from "react-router-dom";

const AdminProviders = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterProviderType, setFilterProviderType] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const navigate = useNavigate();

  const fetchProviders = async () => {
    try {
      const response = await axios.get("/provider-api/provider");
      setProviders(response.data);
    } catch (error) {
      console.error("Error al cargar proveedores:", error.message);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleAddProvider = async (newProvider) => {
    try {
      await axios.post("/provider-api/provider", newProvider);
      await fetchProviders();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error al agregar proveedor:", error.message);
      setErrorMessage(
        error.response?.data?.message || "Error al agregar proveedor. Intenta nuevamente."
      );
    }
  };

  const handleEditProvider = async (id, updatedData) => {
    try {
      await axios.patch(`/provider-api/provider/${id}`, updatedData);
      console.log("Proveedor actualizado");
      fetchProviders();
      setShowEditForm(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Ocurrió un error al actualizar el proveedor.";
      setErrorMessage(errorMessage);
      console.error("Error al editar proveedor:", errorMessage);
    }
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearchTerm =
      searchTerm === "" || provider.rif?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesState =
      filterState === "" || (provider.isActive ? "Activo" : "Inactivo") === filterState;

    const matchesProviderType =
      filterProviderType === "" || provider.providerType === filterProviderType;

    return matchesSearchTerm && matchesState && matchesProviderType;
  });

  const handleViewDetails = (id) => {
    navigate(`/AdminProvidersDetail/${id}`);
  };

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta y administra los proveedores registrados.
          </p>
        </div>

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
            className="w-full md:w-1/4 p-2 border rounded-md"
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
            onClick={() => {
              setSelectedProvider(null);
              setShowAddForm(true);
            }}
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
          >
            Agregar Proveedor
          </button>
        </div>
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
          <thead className="bg-[#00684aff] text-white">
            <tr>
              <th className="px-6 py-3 text-left">RIF</th>
              <th className="px-6 py-3 text-left">Tipo de Proveedor</th>
              <th className="px-6 py-3 text-left">Grúas</th>
              <th className="px-6 py-3 text-left">Conductores</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProviders.map((provider) => (
              <tr key={provider.id} className="border-b">
                <td className="px-6 py-4">{provider.rif}</td>
                <td className="px-6 py-4">{provider.providerType}</td>
                <td className="px-6 py-4">{provider.fleetOfCranes?.length || 0}</td>
                <td className="px-6 py-4">{provider.drivers?.length || 0}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-sm font-medium ${provider.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
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
                  <button
                    onClick={() => handleViewDetails(provider.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showAddForm && (
          <AdminAddProviderForm
            onClose={() => setShowAddForm(false)}
            onSubmit={handleAddProvider}
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
