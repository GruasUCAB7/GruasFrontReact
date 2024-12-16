import React, { useState } from "react";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import AdminAddOrderForm from "../../components/AdminComponents/AdminAddOrderForm";
import AdminEditOrderStatusForm from "../../components/AdminComponents/AdminEditOrderStatusForm";

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      clientId: "1",
      dni: "V-12345678",
      name: "Juan",
      email: "juan@email.com",
      phone: "+58 4121512539",
      status: "Pendiente",
      driver: "Conductor 1",
      journey: {
        origin: "Altamira, Caracas",
        destination: "Chacao, Caracas",
        directionsResponse: null,
      },
    },
    {
      id: 2,
      clientId: "2",
      dni: "V-87654321",
      name: "María",
      email: "maria@email.com",
      phone: "+58 4121512539",
      status: "Completada",
      driver: "Conductor 2",
      journey: {
        origin: "La Castellana, Caracas",
        destination: "El Rosal, Caracas",
        directionsResponse: null,
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditStatusForm, setShowEditStatusForm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "" || order.status === filterStatus) &&
      (order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dni.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddOrder = (newOrder) => {
    const defaultJourney = {
      origin: "Origen no definido",
      destination: "Destino no definido",
      directionsResponse: null,
    };

    setOrders([
      ...orders,
      { ...newOrder, id: orders.length + 1, journey: newOrder.journey || defaultJourney },
    ]);
  };

  const handleEditStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setShowEditStatusForm(false);
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 ml-60 p-8 bg-gray-100 overflow-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Órdenes</h1>
          <p className="text-lg text-gray-600 mt-2">
            Consulta, filtra y administra las órdenes realizadas por los clientes.
          </p>
        </div>

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
                <th className="px-6 py-3 text-left font-medium text-sm">Status</th>
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
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition flex items-center gap-2"
                    >
                      <i className="fas fa-sync-alt"></i> Status
                    </button>
                    <button
                      onClick={() => alert(`Editar orden: ${order.id}`)}
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
