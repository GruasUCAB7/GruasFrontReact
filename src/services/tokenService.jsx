export const getAuthToken = () => localStorage.getItem("authToken");

export const parseToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
};

export const validateToken = () => {
  const token = getAuthToken();
  if (!token) return null;

  const payload = parseToken(token);
  if (!payload || payload.exp * 1000 < Date.now()) {
    localStorage.removeItem("authToken");
    return null;
  }

  return payload;
};
