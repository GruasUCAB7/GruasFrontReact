import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddOrderForm from "../../components/OrderComponents/AdminAddOrderForm";
import AdminEditOrderForm from "../../components/OrderComponents/AdminEditOrderForm";
import AdminAssignedDriver from "../../components/OrderComponents/AdminAssignedDriver";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [operatorId, setOperatorId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null);
  

  const navigate = useNavigate();
  const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
      const operatorIdFromToken = tokenPayload.sub;
      const roleFromToken = tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];



      setOperatorId(operatorIdFromToken);
      setUserRole(roleFromToken);
    } catch (error) {
      console.error("Error al obtener el ID del operador desde el token", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsApiKey}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        return "No disponible";
      }
    } catch (error) {
      return "No disponible";
    }
  };

  const fetchUserName = async (userId) => {
    if (!userId || userId === "Por asignar") return "No asignado";
    try {
      const response = await axios.get(`/user-api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data.name;
    } catch (error) {
      return "No encontrado";
    }
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/order-api/order", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const ordersWithDetails = await Promise.all(
        response.data.map(async (order) => {
          const incidentAddress = await fetchAddress(
            order.incidentAddress.latitude,
            order.incidentAddress.longitude
          );
          const destinationAddress = await fetchAddress(
            order.destinationAddress.latitude,
            order.destinationAddress.longitude
          );

          const operatorName = await fetchUserName(order.operatorAssigned);
          const driverName = await fetchUserName(order.driverAssigned);

          return {
            ...order,
            incidentAddress: incidentAddress || "No disponible",
            destinationAddress: destinationAddress || "No disponible",
            createdByOperator: operatorName || "No encontrado",
            driverAssigned: driverName || "No asignado",
          };
        })
      );

      setOrders(ordersWithDetails);
      setLoading(false);
    } catch (error) {
      setErrorMessage("Error al cargar las órdenes. Intenta nuevamente.");
      setLoading(false);
    }
  }, [googleMapsApiKey]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "" || order.status === filterStatus) &&
      (order.createdByOperator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.driverAssigned.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Cargando órdenes...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />

      <div className="flex-1 ml-30 p-8 bg-gray-100 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Órdenes</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta y administra las órdenes realizadas por los clientes.
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
            placeholder="Buscar por operador o conductor"
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
            <option value="Pendiente">Pendiente</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <button
            className="bg-[#00684aff] text-white px-4 py-2 rounded-md shadow-lg hover:bg-[#07835fff] transition"
            onClick={() => setShowAddForm(true)}
          >
            Agregar Orden
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-[#00684aff] text-white">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-sm">Operador</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Conductor</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Dirección del Incidente</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Dirección de Destino</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Tipo de Incidente</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Fecha del Incidente</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Costo Total</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.createdByOperator}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.driverAssigned}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.incidentAddress}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.destinationAddress}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.incidentType}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.incidentDate}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.totalCost}</td>
                  <td
                    className={`px-6 py-4 font-semibold text-sm ${order.status === "Pendiente"
                      ? "text-yellow-500"
                      : order.status === "Completada"
                        ? "text-green-500"
                        : "text-red-500"
                      }`}
                  >
                    {order.status}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowEditForm(true);
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOrderForDriver(order);
                        setShowAssignDriver(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Asignar Conductor
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showAddForm && (
          <AdminAddOrderForm
            operatorId={operatorId}
            onClose={() => setShowAddForm(false)}
            onSubmitSuccess={fetchOrders}
          />
        )}
        {showAssignDriver && selectedOrderForDriver && (
          <AdminAssignedDriver
            orderId={selectedOrderForDriver.id}
            onClose={() => setShowAssignDriver(false)}
            onDriverAssigned={fetchOrders}
          />
        )}
        {showEditForm && selectedOrder && (
          <AdminEditOrderForm
            order={selectedOrder}
            onClose={() => setShowEditForm(false)}
            onSubmitSuccess={fetchOrders}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
