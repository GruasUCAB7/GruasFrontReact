import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";

const AdminProvidersDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [cranes, setCranes] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const providerResponse = await axios.get(`/provider-api/provider/${id}`);
        setProvider(providerResponse.data);

        if (providerResponse.data.fleetOfCranes.length > 0) {
          const cranesResponse = await Promise.all(
            providerResponse.data.fleetOfCranes.map((craneId) =>
              axios.get(`/provider-api/crane/${craneId}`)
            )
          );
          setCranes(cranesResponse.map((res) => res.data));
        }

        if (providerResponse.data.drivers.length > 0) {
          const driversResponse = await Promise.all(
            providerResponse.data.drivers.map((driverId) =>
              axios.get(`/provider-api/driver/${driverId}`)
            )
          );
          setDrivers(driversResponse.map((res) => res.data));
        }
      } catch (error) {
        setErrorMessage("No se pudieron cargar los detalles del proveedor.");
      }
    };

    fetchDetails();
  }, [id]);

  if (!provider) {
    return (
      <div className="flex">
        <AdminNavbar />
        <div className="flex-1 ml-60 p-8 bg-gray-100">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <h1 className="text-3xl font-bold text-center">Cargando...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar />
      <div className="flex-1 ml-60 p-8 bg-gray-100">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Detalle del Proveedor
          </h1>
          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
              {errorMessage}
            </div>
          )}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                📝 Información del Proveedor
              </h2>
              <p>
                <strong>RIF:</strong> {provider.rif}
              </p>
              <p>
                <strong>Tipo:</strong> {provider.providerType}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <span
                  className={
                    provider.isActive ? "text-green-600" : "text-red-600"
                  }
                >
                  {provider.isActive ? "Activo" : "Inactivo"}
                </span>
              </p>
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                🚚 Grúas Asociadas
              </h2>
              {cranes.length > 0 ? (
                cranes.map((crane) => (
                  <div
                    key={crane.id}
                    className="p-4 bg-gray-50 rounded-md shadow-md mb-4"
                  >
                    <p>
                      <strong>Placa:</strong> {crane.plate}
                    </p>
                    <p>
                      <strong>Marca:</strong> {crane.brand}
                    </p>
                    <p>
                      <strong>Modelo:</strong> {crane.model}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {crane.craneType}
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={
                          crane.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {crane.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No hay grúas asociadas.</p>
              )}
            </div>

            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold mb-4 bg-gray-100 p-3 rounded">
                🧑‍🔧 Conductores Asociados
              </h2>
              {drivers.length > 0 ? (
                drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="p-4 bg-gray-50 rounded-md shadow-md mb-4"
                  >
                    <p>
                      <strong>DNI:</strong> {driver.dni}
                    </p>
                    <p>
                      <strong>Licencia:</strong> {" "}
                      <span
                        className={
                          driver.isActiveLicensed ? "text-green-600" : "text-red-600"
                        }
                      >
                        {driver.isActiveLicensed ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                    <p>
                      <strong>Estado:</strong>{" "}
                      <span
                        className={
                          driver.isActive ? "text-green-600" : "text-red-600"
                        }
                      >
                        {driver.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </p>
                  </div>
                ))
              ) : (
                <p>No hay conductores asociados.</p>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={() => navigate(-1)}
                className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProvidersDetail;