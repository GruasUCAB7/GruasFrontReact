import apiInstance from "./apiService";

export const fetchOrders = async () => {
    try {
        const response = await apiInstance.get("/order-api/order", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        console.log("Respuesta de fetchOrders:", response.data); // Log para verificar
        return response.data; // Asegúrate de devolver los datos correctamente
    } catch (error) {
        console.error("Error en fetchOrders:", error);
        throw error; // Lanza el error para manejarlo en el llamado
    }
};


export const fetchOrderById = async (orderId) => {
    try {
        const response = await apiInstance.get(`/order-api/order/${orderId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data; // Devuelve la orden específica
    } catch (error) {
        console.error(`Error al obtener la orden con ID ${orderId}:`, error);
        throw error;
    }
};
