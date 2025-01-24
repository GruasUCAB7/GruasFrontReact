import apiInstance from "./apiService";

export const fetchUserName = async (userId) => {
  try {
    const response = await apiInstance.get(`/user-api/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    return response.data.name || "No encontrado";
  } catch (error) {
    return "No encontrado";
  }
};
