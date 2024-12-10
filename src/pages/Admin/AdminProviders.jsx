import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavBar";
import AdminAddProviderForm from "../../components/AdminAddProviderForm";
import { useNavigate } from "react-router-dom";

const AdminProviders = () => {
  const navigate = useNavigate();

  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "Transporte",
      email: "perez@transportes.com",
      phone: "+58 4121234567",
      entryDate: "01/03/2023",
    },
    {
      id: 2,
      name: "Grúas",
      email: "lopez@gruas.com",
      phone: "+58 4129876543",
      entryDate: "12/06/2023",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProvider = (newProvider) => {
    setProviders([...providers, { ...newProvider, id: providers.length + 1 }]);
  };

  const handleEditProvider = (updatedProvider) => {
    setProviders(
      providers.map((provider) =>
        provider.id === updatedProvider.id ? updatedProvider : provider
      )
    );
  };

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 bg-gray-100 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Proveedores</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta, administra y agrega nuevos proveedores.
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por nombre o email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />

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

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">ID</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Proveedor</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Email</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Teléfono</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Fecha de Ingreso</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProviders.map((provider) => (
                <tr key={provider.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.id}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.phone}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{provider.entryDate}</td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    {/* Botón Ver Detalles */}
                    <button
                      onClick={() => navigate(`/AdminCranes?providerId=${provider.id}`)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Ver Detalles
                    </button>

                    {/* Botón Editar */}
                    <button
                      onClick={() => {
                        setSelectedProvider(provider);
                        setShowAddForm(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition flex items-center gap-2"
                    >
                      <i className="fas fa-edit"></i> Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <AdminAddProviderForm
            provider={selectedProvider}
            onClose={() => setShowAddForm(false)}
            onSubmit={selectedProvider ? handleEditProvider : handleAddProvider}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProviders;
