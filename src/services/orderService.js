import apiInstance from "./apiService";

export const fetchOrders = async () => {
    try {
        const response = await apiInstance.get("/order-api/order", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });
        return response.data; // Asegúrate de devolver los datos correctamente
    } catch (error) {
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
        throw error;
    }
};

export const updateOrderStatusToPaid = async (orderId) => {
    if (!orderId) {
      throw new Error("El ID de la orden no está disponible.");
    }
  
    const data = {
      orderPaidResponse: true,
    };
  
    try {
      const response = await apiInstance.put(`/order-api/order/${orderId}/updateOrderStatusToPaid`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  