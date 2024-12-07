import React, { useState } from "react";
import AdminNavbar from "../../components/AdminNavBar";
import AdminAddOrderForm from "../../components/AdminAddOrderForm";

const AdminOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      clientId: "123",
      dni: "V-12345678",
      name: "Juan",
      email: "juan@email.com",
      phone: "+58 4121512539",
      status: "Pendiente",
    },
    {
      id: 2,
      clientId: "124",
      dni: "V-87654321",
      name: "María",
      email: "maria@email.com",
      phone: "+58 4121512539",
      status: "Completada",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredOrders = orders.filter((order) => {
    return (
      (filterStatus === "" || order.status === filterStatus) &&
      (order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.dni.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleAddOrder = (newOrder) => {
    setOrders([...orders, { ...newOrder, id: orders.length + 1 }]);
  };

  return (
    <div className="flex">
      <AdminNavbar />

      <div className="flex-1 bg-gray-100 p-8">
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
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-blue-500 hover:underline flex items-center gap-2"
                      onClick={() => alert(`Editar orden: ${order.id}`)}
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
      </div>
    </div>
  );
};

export default AdminOrders;
