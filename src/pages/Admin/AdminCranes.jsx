import React, { useState } from "react";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddCraneForm from "../../components/AdminComponents/AdminAddCraneForm";
import AdminAddDriverForm from "../../components/AdminComponents/AdminAddDriverForm";
import { useSearchParams } from "react-router-dom";

const AdminCranes = () => {
  const [searchParams] = useSearchParams();
  const providerId = searchParams.get("providerId");

  const [cranes, setCranes] = useState([
    {
      id: 1,
      providerId: 1,
      brand: "Toyota",
      model: "Land Cruiser",
      plate: "AEE46A",
      type: "Pesada",
      year: "2015",
    },
    {
      id: 2,
      providerId: 1,
      brand: "Ford",
      model: "F-350",
      plate: "AEE46A",
      type: "Mediana",
      year: "2018",
    },
  ]);

  const [drivers, setDrivers] = useState([
    {
      id: 1,
      providerId: 1,
      dni: "V-12345678",
      licenseStatus: "Activa",
      craneId: 1,
      driverStatus: "Activo",
      creationDate: "01/01/2023",
    },
    {
      id: 2,
      providerId: 1,
      dni: "V-87654321",
      licenseStatus: "Inactiva",
      craneId: 2,
      driverStatus: "Inactivo",
      creationDate: "15/03/2023",
    },
  ]);

  const [showAddCraneForm, setShowAddCraneForm] = useState(false);
  const [showAddDriverForm, setShowAddDriverForm] = useState(false);
  const [selectedCrane, setSelectedCrane] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCranes = cranes.filter(
    (crane) =>
      crane.providerId === Number(providerId) &&
      (crane.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crane.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crane.plate.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.providerId === Number(providerId) &&
      (driver.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.craneId.toString().includes(searchTerm))
  );

  const handleAddCrane = (newCrane) => {
    setCranes([...cranes, { ...newCrane, id: cranes.length + 1 }]);
  };

  const handleEditCrane = (updatedCrane) => {
    setCranes(
      cranes.map((crane) =>
        crane.id === updatedCrane.id ? updatedCrane : crane
      )
    );
  };

  const handleAddDriver = (newDriver) => {
    setDrivers([...drivers, { ...newDriver, id: drivers.length + 1 }]);
  };

  const handleEditDriver = (updatedDriver) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === updatedDriver.id ? updatedDriver : driver
      )
    );
  };

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Grúas y Conductores del Proveedor (ID: {providerId})
        </h1>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por marca, modelo, placa o DNI"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />

          <button
            onClick={() => {
              setSelectedCrane(null);
              setShowAddCraneForm(true);
            }}
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
          >
            Agregar Grúa
          </button>

          <button
            onClick={() => {
              setSelectedDriver(null);
              setShowAddDriverForm(true);
            }}
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
          >
            Agregar Conductor
          </button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Grúas</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">ID</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Marca</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Modelo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Placa</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tipo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Año</th>
                <th className="px-6 py-3 text-center font-medium text-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCranes.map((crane) => (
                <tr key={crane.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.id}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.brand}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.model}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.plate}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.type}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.year}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedCrane(crane);
                          setShowAddCraneForm(true);
                        }}
                        className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Conductores</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">DNI</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Licencia</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Grúa Asignada</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estatus</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Fecha Creación</th>
                <th className="px-6 py-3 text-center font-medium text-sm">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.dni}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.licenseStatus}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.craneId}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.driverStatus}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{driver.creationDate}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setShowAddDriverForm(true);
                        }}
                        className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                      >
                        <i className="fas fa-edit"></i> Editar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddCraneForm && (
          <AdminAddCraneForm
            crane={selectedCrane}
            onClose={() => setShowAddCraneForm(false)}
            onSubmit={selectedCrane ? handleEditCrane : handleAddCrane}
          />
        )}

        {showAddDriverForm && (
          <AdminAddDriverForm
            driver={selectedDriver}
            onClose={() => setShowAddDriverForm(false)}
            onSubmit={selectedDriver ? handleEditDriver : handleAddDriver}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCranes;
