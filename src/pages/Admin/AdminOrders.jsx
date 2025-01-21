import React, { useState, useEffect, useCallback } from "react";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminViewExtraCost from "../../components/OrderComponents/AdminViewExtraCost";
import AdminDetailView from "../../components/OrderComponents/AdminDetailView";
import AdminAddOrderForm from "../../components/OrderComponents/AdminAddOrderForm";
import AdminEditOrderForm from "../../components/OrderComponents/AdminEditOrderForm";
import AdminAssignedDriver from "../../components/OrderComponents/AdminAssignedDriver";
import AdminAssignedDriverAutomatic from "../../components/OrderComponents/AdminAssignedDriverAutomatic";
import { fetchAddressFromCoordinates } from "../../services/locationService";
import useAuthValidation from "../../services/useAuthValidation";
import { fetchUserName } from "../../services/userService";
import { fetchOrders } from "../../services/orderService";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  //Agregar Orden
  const [showAddForm, setShowAddForm] = useState(false);
  //Editar Orden
  const [showEditForm, setShowEditForm] = useState(false);
  //Ver Detalle Orden
  const [showDetailOrder, setShowDetailOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  //Costos Extras
  const [showExtraCost, setShowExtraCost] = useState(false);
  const [selectedOrderForExtraCost, setSelectedOrderForExtraCost] = useState(null);
  //Asignar Conductor
  const [showAssignDriver, setShowAssignDriver] = useState(false);
  const [selectedOrderForDriver, setSelectedOrderForDriver] = useState(null);
  //Asignar Conductor Automatico
  const [showAssignDriverAutomatic, setShowAssignDriverAutomatic] = useState(false);
  const [selectedOrderForDriverAutomatic, setSelectedOrderForDriverAutomatic] = useState(null);

  const { operatorId, userRole } = useAuthValidation();

  const fetchOrdersWithDetails = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Iniciando solicitud de órdenes...");
      const data = await fetchOrders();
      console.log("Órdenes recibidas:", data);

      const ordersWithDetails = await Promise.all(
        data.map(async (order) => {
          try {
            console.log("Procesando orden:", order);
            const incidentAddress = await fetchAddressFromCoordinates(
              order.incidentAddress.latitude,
              order.incidentAddress.longitude
            );
            console.log("Dirección del incidente obtenida:", incidentAddress);

            const destinationAddress = await fetchAddressFromCoordinates(
              order.destinationAddress.latitude,
              order.destinationAddress.longitude
            );
            console.log("Dirección de destino obtenida:", destinationAddress);

            const operatorName = await fetchUserName(order.operatorAssigned);
            console.log("Nombre del operador obtenido:", operatorName);

            const driverName = await fetchUserName(order.driverAssigned);
            console.log("Nombre del conductor obtenido:", driverName);

            return {
              ...order,
              incidentAddress: incidentAddress || "No disponible",
              destinationAddress: destinationAddress || "No disponible",
              createdByOperator: operatorName || "No encontrado",
              driverAssigned: driverName || "No asignado",
            };
          } catch (processingError) {
            console.error("Error procesando una orden:", processingError);
            return order;
          }
        })
      );

      console.log("Órdenes procesadas:", ordersWithDetails);
      setOrders(ordersWithDetails);
    } catch (error) {
      console.error("Error al cargar las órdenes:", error); // Log detallado
      setErrorMessage(
        error.response?.data?.message ||
        (error.response?.status === 401
          ? "El token ha expirado o no es válido. Por favor, inicia sesión nuevamente."
          : "Hubo un error al cargar las órdenes. Intenta nuevamente.")
      );
    } finally {
      setLoading(false);
      console.log("Finalizado el proceso de carga de órdenes.");
    }
  }, []);

  useEffect(() => {
    if (!operatorId || !userRole) return;
    fetchOrdersWithDetails();
  }, [fetchOrdersWithDetails, operatorId, userRole]);

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

        {successMessage && (
          <div className="mb-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">
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
                  <td className="px-6 py-4 text-gray-700 text-sm text-center">{order.status}</td>
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
                          setSelectedOrder(order);
                          setShowEditForm(true);
                        }}
                        className="bg-yellow-400 text-white px-4 py-2 rounded-md hover:bg-yellow-500 transition"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderForDriver(order);
                          setShowAssignDriver(true);
                        }}
                        className={`px-4 py-2 rounded-md transition text-white ${order.driverAssigned === "No asignado"
                          ? "bg-blue-400 hover:bg-blue-500"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                        disabled={order.driverAssigned !== "No asignado"}
                      >
                        Asignar Conductor
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrderForDriverAutomatic(order);
                          setShowAssignDriverAutomatic(true);
                        }}
                        className={`px-4 py-2 rounded-md transition text-white ${order.driverAssigned === "No asignado"
                          ? "bg-green-400 hover:bg-green-500"
                          : "bg-gray-300 cursor-not-allowed"
                          }`}
                        disabled={order.driverAssigned !== "No asignado"}
                      >
                        Asignar Automático
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
        {/* Editar Orden */}
        {showEditForm && selectedOrder && (
          <AdminEditOrderForm
            order={selectedOrder}
            onClose={() => setShowEditForm(false)}
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
            onClose={() => setShowExtraCost(false)}
          />
        )}

        {showAssignDriver && selectedOrderForDriver && (
          <AdminAssignedDriver
            orderId={selectedOrderForDriver.id}
            onClose={() => setShowAssignDriver(false)}
            onDriverAssigned={fetchOrdersWithDetails}
          />
        )}
        {showAssignDriverAutomatic && selectedOrderForDriverAutomatic && (
          <AdminAssignedDriverAutomatic
            orderId={selectedOrderForDriverAutomatic.id}
            onClose={() => setShowAssignDriverAutomatic(false)}
            onDriverAssigned={fetchOrdersWithDetails}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
