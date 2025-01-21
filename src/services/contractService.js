import apiInstance from "./apiService";

export const fetchContractNumber = async (contractId) => {
  if (!contractId) return "No disponible";

  try {
    const response = await apiInstance.get(`/order-api/contract/${contractId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data.contractNumber || "No disponible";
  } catch (error) {
    console.error("Error al obtener el número del contrato:", error);
    return "No disponible";
  }
};
