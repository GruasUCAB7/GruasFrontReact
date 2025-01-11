import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddOrderForm from "../../components/AdminComponents/AdminAddOrderForm";
import AdminEditOrderStatusForm from "../../components/AdminComponents/AdminEditOrderStatusForm";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditStatusForm, setShowEditStatusForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
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

      if (role !== "Admin" && role !== "Operator") {
        console.error("Acceso denegado: Rol no autorizado.");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      navigate("/login");
    }
  }, [navigate]);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("/order-api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const formattedOrders = response.data.map((order) => ({
        id: order.id,
        clientId: order.clientId,
        dni: order.dni,
        name: order.name,
        email: order.email,
        phone: order.phone,
        status: order.status,
        driver: order.driver || "No asignado",
        journey: order.journey || { origin: "N/A", destination: "N/A" },
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error al obtener las órdenes:", error.message);
      setErrorMessage("Error al cargar las órdenes. Intenta nuevamente.");
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleAddOrder = async (newOrder) => {
    try {
      await fetchOrders();
      setSuccessMessage("¡Orden agregada exitosamente!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al agregar la orden:", error.message);
    }
  };

  const handleEditStatus = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccessMessage("¡Estado de la orden actualizado exitosamente!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error al actualizar el estado de la orden:", error.message);
      setErrorMessage("Error al actualizar el estado. Intenta nuevamente.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "" || order.status === filterStatus) &&
      (order.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dni?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />

      <div className="flex-1 pl-30 p-8 bg-gray-100 overflow-auto">
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
            placeholder="Buscar por nombre, email o DNI"
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
                <th className="px-6 py-3 text-left font-medium text-sm">ID Cliente</th>
                <th className="px-6 py-3 text-left font-medium text-sm">DNI</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Nombre</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Email</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Teléfono</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Conductor</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Viaje</th>
                <th className="px-6 py-3 text-left font-medium text-sm">Estado</th>
                <th className="px-6 py-3 text-center font-medium text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.clientId}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.dni}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.name}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.email}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.phone}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{order.driver}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">
                    {order.journey.origin} - {order.journey.destination}
                  </td>
                  <td
                    className={`px-6 py-4 font-semibold text-sm ${
                      order.status === "Pendiente"
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
                        setShowEditStatusForm(true);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
                    >
                      Editar Estado
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showAddForm && (
          <AdminAddOrderForm
            onClose={() => setShowAddForm(false)}
            onAddOrder={handleAddOrder}
          />
        )}

        {showEditStatusForm && selectedOrder && (
          <AdminEditOrderStatusForm
            order={selectedOrder}
            onClose={() => setShowEditStatusForm(false)}
            onSave={handleEditStatus}
          />
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
