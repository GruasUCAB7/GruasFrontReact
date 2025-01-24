import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiInstance from "../../services/apiService";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import ProviderAddCraneForm from "../../components/ProviderComponents/ProviderAddCraneForm";
import ProviderEditCraneForm from "../../components/ProviderComponents/ProviderEditCraneForm";
import NotificationCard from "../../components/Notification/NotificationCard";

const ProviderCranes = () => {
  const { id } = useParams();
  const [cranes, setCranes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info",
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCrane, setSelectedCrane] = useState(null);
  const navigate = useNavigate();

  const showNotification = (message, type = "info") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

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

  const fetchCranes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiInstance.get(`/provider-api/provider/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const { fleetOfCranes } = response.data;

      if (!fleetOfCranes || fleetOfCranes.length === 0) {
        showNotification("No hay grúas asignadas al proveedor.", "info");
        setCranes([]);
        return;
      }

      const craneData = await Promise.all(
        fleetOfCranes.map(async (craneId) => {
          try {
            const craneResponse = await apiInstance.get(`/provider-api/crane/${craneId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
            return craneResponse.data;
          } catch (error) {
            console.error(`Error al obtener datos de la grúa con ID ${craneId}:`, error);
            return null;
          }
        })
      );

      setCranes(craneData.filter((crane) => crane !== null));
    } catch (error) {
      console.error("Error al cargar las grúas:", error);
      showNotification("Error al cargar las grúas. Intenta nuevamente.", "error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCranes();
  }, [fetchCranes]);

  const handleAddCrane = async (newCrane) => {
    try {
      const craneResponse = await apiInstance.get(`/provider-api/crane/${newCrane.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const completeCrane = craneResponse.data;

      setCranes((prevCranes) => [...prevCranes, completeCrane]);
      showNotification("¡Grúa agregada exitosamente!", "success");
    } catch (error) {
      console.error("Error al agregar la grúa:", error);
      showNotification("Error al agregar la grúa. Intenta nuevamente.", "error");
    }
  };

  const handleUpdateCrane = (updatedCrane) => {
    try {
      setCranes((prevCranes) =>
        prevCranes.map((crane) =>
          crane.id === updatedCrane.id ? { ...crane, ...updatedCrane } : crane
        )
      );
      showNotification("¡Grúa actualizada exitosamente!", "success");
    } catch (error) {
      console.error("Error al actualizar la grúa:", error);
      showNotification("Error al actualizar la grúa. Intenta nuevamente.", "error");
    }
  };

  const filteredCranes = cranes.filter((crane) => {
    const matchesSearchTerm =
      (crane.brand?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (crane.model?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (crane.plate?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesFilterStatus =
      filterStatus === "" || crane.isActive === (filterStatus === "Activo");

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

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />
      <div className="flex-1 ml-30 p-8 bg-gray-100 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Grúas del Proveedor</h1>

        {notification.visible && (
          <NotificationCard
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por marca, modelo o placa"
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
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>

          <button
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Grúa
          </button>
        </div>

        {filteredCranes.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">Marca</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Modelo</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Placa</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tamaño</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Año</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCranes.map((crane) => (
                <tr key={crane.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.brand}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.model}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.plate}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.craneSize}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{crane.year}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${crane.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                        }`}
                    >
                      {crane.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedCrane(crane);
                        setShowEditForm(true);
                      }}
                      className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-700">No hay grúas registradas para este proveedor.</p>
        )}
        {showAddForm && (
          <ProviderAddCraneForm
            onClose={() => setShowAddForm(false)}
            onAddCrane={handleAddCrane}
            providerId={id}
          />
        )}
        {showEditForm && selectedCrane && (
          <ProviderEditCraneForm
            crane={selectedCrane}
            onClose={() => setShowEditForm(false)}
            onUpdateSuccess={handleUpdateCrane}
          />
        )}
      </div>
    </div>
  );
};

export default ProviderCranes;
