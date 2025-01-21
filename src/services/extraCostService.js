import apiInstance from "./apiService";

export const fetchExtraCostsByOrderId = async (orderId) => {
  if (!orderId) {
    throw new Error("El ID de la orden no está disponible.");
  }

  try {
    const response = await apiInstance.get(`/order-api/order/getExtraCostByOrderId`, {
      params: { orderId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data.extraCosts || [];
  } catch (error) {
    console.error("Error al obtener los costos extras:", error);
    throw error;
  }
};


export const validatePriceExtraCost = async (orderId, extraCosts, operatorResponse = true) => {
    if (!orderId) {
      throw new Error("El ID de la orden no está disponible.");
    }
  
    const data = {
      operatorRespose: operatorResponse,
      extrasCostApplied: extraCosts.map((cost) => ({
        id: cost.id,
        name: cost.name,
        price: cost.price,
      })),
    };
  
    try {
      const response = await apiInstance.patch(`/order-api/order/${orderId}/validatePricesExtraCost`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al validar los precios extras:", error);
      throw error;
    }
  };
  