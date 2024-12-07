import React, { useState } from "react";

const AdminAddUserForm = ({ onClose, onAddUser }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        type: "Usuario",
        status: "Activo",
        department: "",
        creationDate: new Date().toISOString().split("T")[0],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddUser(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Agregar Usuario</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium">Nombre</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Teléfono</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Tipo de Usuario</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="Usuario">Usuario</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Estado</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Departamento</label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium">Fecha de Creación</label>
                        <input
                            type="date"
                            name="creationDate"
                            value={formData.creationDate}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
                        >
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAddUserForm;
