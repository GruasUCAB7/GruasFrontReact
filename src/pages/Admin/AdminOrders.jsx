import React, { useState, useEffect, useCallback } from "react";
import apiInstance from "../../services/apiService";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminViewExtraCost from "../../components/OrderComponents/AdminViewExtraCost";
import AdminDetailView from "../../components/OrderComponents/AdminDetailView";
import AdminAddOrderForm from "../../components/OrderComponents/AdminAddOrderForm";
import AdminAssignedDriver from "../../components/OrderComponents/AdminAssignedDriver";
import { fetchAddressFromCoordinates } from "../../services/locationService";
import useAuthValidation from "../../services/useAuthValidation";
import { fetchUserName } from "../../services/userService";
import { fetchOrders, updateOrderStatusToPaid } from "../../services/orderService";
import { fetchDriversWithDetailsAndDistances } from "../../services/driverService";
import NotificationCard from "../../components/Notification/NotificationCard";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);
  //Agregar Orden
  const [showAddForm, setShowAddForm] = useState(false);
  //Ver Detalle Orden
  const [showDetailOrder, setShowDetailOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  //Costos Extras
  const [showExtraCost, setShowExtraCost] = useState(false);
  const [selectedOrderForExtraCost, setSelectedOrderForExtraCost] = useState(null);
  //Asignar Conductor
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null);

  const { operatorId, userRole } = useAuthValidation();

  const [notification, setNotification] = useState({
    visible: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({ visible: true, message, type });
    setTimeout(() => setNotification({ ...notification, visible: false }), 3000);
  };

  const handleAutomaticAssignment = async (order) => {
    try {
      setLoading(true);

      const drivers = await fetchDriversWithDetailsAndDistances(order, localStorage.getItem("authToken"));

      if (drivers.length === 0) {
        showNotification("No hay conductores disponibles para esta orden.", "error");
        return;
      }

      const closestDriver = drivers[0]; // Seleccionar el más cercano

      await apiInstance.put(
        `/order-api/order/${order.id}/updateDriverAssigned`,
        { driverAssigned: closestDriver.id },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      await apiInstance.patch(
        `/provider-api/driver/${closestDriver.id}`,
        { isAvailable: false },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );

      showNotification(`Conductor ${closestDriver.name} asignado automáticamente.`, "success");
      fetchOrdersWithDetails(); // Actualizar lista de órdenes
    } catch (error) {
      console.error("Error en la asignación automática:", error);
      showNotification("Error al realizar la asignación automática.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersWithDetails = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();

      const ordersWithDetails = await Promise.all(
        data.map(async (order) => {
          try {
            const incidentAddress = await fetchAddressFromCoordinates(
              order.incidentAddress.latitude,
              order.incidentAddress.longitude
            );

            const destinationAddress = await fetchAddressFromCoordinates(
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
          } catch (processingError) {
            showNotification("Error al procesar detalles de una orden.", "error");
            return order;
          }
        })
      );

      setOrders(ordersWithDetails);
    } catch (error) {
      showNotification(
        error.response?.data?.message ||
          (error.response?.status === 401
            ? "El token ha expirado o no es válido. Por favor, inicia sesión nuevamente."
            : "Hubo un error al cargar las órdenes. Intenta nuevamente."),
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!operatorId || !userRole) return;
    fetchOrdersWithDetails();
  }, [fetchOrdersWithDetails, operatorId, userRole]);

  const handleMarkAsPaid = async (orderId) => {
    try {
      await updateOrderStatusToPaid(orderId);
      showNotification("Orden marcada como pagada con éxito.", "success");
      fetchOrdersWithDetails();
    } catch (error) {
      showNotification("Hubo un error al marcar la orden como pagada.", "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "" || order.status === filterStatus) &&
      (order.createdByOperator?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.driverAssigned?.toLowerCase().includes(searchTerm.toLowerCase()))
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
          <p className="text-lg text-gray-600 mt-2">Consulta y administra las órdenes realizadas por los clientes.</p>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar por operador o conductor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/3 p-2 border rounded-md"
          />

          {/* Filtro de estados actualizado */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-1/4 p-2 border rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="Por Asignar">Por Asignar</option>
            <option value="Por Aceptar">Por Aceptar</option>
            <option value="Aceptado">Aceptado</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Pagado">Pagado</option>
          </select>

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
                <th className="px-6 py-3 text-center font-medium text-sm">Operador</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Conductor</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm text-center">{order.createdByOperator}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm text-center">{order.driverAssigned}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-md text-sm font-medium ${order.status === "Aceptado" || order.status === "Finalizado" || order.status === "Pagado"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2 justify-center text-center">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetailOrder(true);
                        }}
                        className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                      >
                        Ver Detalle
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderForExtraCost(order);
                          setShowExtraCost(true);
                        }}
                        className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                      >
                        Costos Extras
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderForDriver(order); // Selecciona la orden actual
                          setShowAssignDriver(true); // Muestra el modal para asignar conductor
                        }}
                        className={`px-4 py-2 rounded-md transition text-white ${order.status === "Por Asignar"
                          ? "bg-blue-400 hover:bg-blue-500"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                        disabled={order.status !== "Por Asignar"} // Botón habilitado solo si la orden está "Por Asignar"
                      >
                        Asignar Conductor
                      </button>

                      <button
                        onClick={() => handleAutomaticAssignment(order)}
                        className={`px-4 py-2 rounded-md transition text-white ${order.status === "Por Asignar" ? "bg-green-400 hover:bg-green-500" : "bg-gray-300 cursor-not-allowed"
                          }`}
                        disabled={order.status !== "Por Asignar"} // Solo habilitado si el estado es "Por Asignar"
                      >
                        Asignar Automático
                      </button>

                      <button
                        onClick={() => handleMarkAsPaid(order.id)}
                        className={`text-white px-4 py-2 rounded-md transition ${order.status === "Finalizado"
                          ? "bg-red-500 hover:bg-red-400"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                      >
                        Pagado
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Agregar Orden */}
        {showAddForm && (
          <AdminAddOrderForm
            operatorId={operatorId}
            onClose={() => setShowAddForm(false)}
            onSubmitSuccess={fetchOrdersWithDetails}
          />
        )}
        {/* Ver Detalle Orden */}
        {showDetailOrder && selectedOrder && (
          <AdminDetailView
            order={selectedOrder}
            onClose={() => setShowDetailOrder(false)}
          />
        )}
        {/* Ver Costos Extras */}
        {showExtraCost && selectedOrderForExtraCost && (
          <AdminViewExtraCost
            orderId={selectedOrderForExtraCost.id}
            orderStatus={selectedOrderForExtraCost.status}
            onClose={() => setShowExtraCost(false)}
          />
        )}
        {/* Asignar Automaticamente */}
        {showAssignDriver && selectedOrderForDriver && (
          <AdminAssignedDriver
            orderId={selectedOrderForDriver.id}
            onClose={() => setShowAssignDriver(false)}
            onDriverAssigned={fetchOrdersWithDetails}
          />
        )}
        {/* Componente de notificaciones */}
        {notification.visible && (
          <NotificationCard
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
