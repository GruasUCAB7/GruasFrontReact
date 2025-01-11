import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../axiosInstance";
import AdminNavbar from "../../components/AdminComponents/AdminNavBar";
import defaultProfileImg from "../../static/img/default-profile.png";

const AdminProfile = () => {
  const [userData, setUserData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setIsLoading] = useState(true);
  const [profileErrorMessage, setProfileErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    department: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [modalErrorMessage, setModalErrorMessage] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(authToken.split(".")[1]));
      const isExpired = tokenPayload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("authToken");
        navigate("/login");
        return;
      }

      setUserRole(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      const userId = tokenPayload.sub;
      fetchUserData(userId, authToken);
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserData = async (userId, authToken) => {
    try {
      const response = await axios.get(`/user-api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setUserData(response.data);
      setFormData({
        phone: response.data.phone,
        department: response.data.department,
      });
      setIsLoading(false);
    } catch (error) {
      setProfileErrorMessage("Error al cargar los datos del perfil. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await axios.patch(
        `/user-api/user/${userData.id}`,
        {
          phone: formData.phone,
          department: formData.department,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setUserData((prev) => ({
        ...prev,
        phone: formData.phone,
        department: formData.department,
      }));
      setSuccessMessage("¡Datos actualizados exitosamente!");
      setIsEditingProfile(false);
    } catch (error) {
      setModalErrorMessage(
        error.response?.data?.message || "Error al actualizar los datos. Intenta nuevamente."
      );
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setModalErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    try {
      const authToken = localStorage.getItem("authToken");
      await axios.post(
        `/api/Auth/update-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setSuccessMessage("¡Contraseña actualizada exitosamente!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      setModalErrorMessage(
        error.response?.data?.message || "Error al cambiar contraseña. Intenta nuevamente."
      );
    }
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">Cargando datos...</h1>
        </div>
      </div>
    );
  }
  if (profileErrorMessage) {
    return (
      <div>
        <AdminNavbar userRole={userRole} />
        <div className="flex items-center justify-center h-screen bg-gray-100">
          <h1 className="text-2xl font-bold text-red-600">{profileErrorMessage}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminNavbar userRole={userRole} />

      <div className="flex-1 ml-30 p-8 bg-gray-100 overflow-auto">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {successMessage && (
            <div className="mt-4 text-sm text-green-600 bg-green-100 p-3 rounded-md">
              {successMessage}
            </div>
          )}
          <div className="relative flex flex-col items-center mb-6">
            <div className="relative w-24 h-24">
              <img
                src={defaultProfileImg}
                alt="Foto de Perfil"
                className="w-full h-full rounded-full border-2 border-gray-200 shadow-lg object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mt-4 text-center">
              {userData.name}
            </h1>
            <p className="text-gray-600 text-sm text-center">{userData.role}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Información General
              </h2>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Email:</p>
                <p className="text-gray-500">{userData.email}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Teléfono:</p>
                <p className="text-gray-500">{userData.phone}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 font-medium">Departamento:</p>
                <p className="text-gray-500">{userData.department}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Cambiar Contraseña
            </button>
            <button
              onClick={() => setIsEditingProfile(true)}
              className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
            >
              Editar Perfil
            </button>
          </div>
        </div>
      </div>

      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Cambiar Contraseña</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Contraseña Actual</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-2 top-2 text-gray-600"
                  >
                    {passwordVisibility.current ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-2 top-2 text-gray-600"
                  >
                    {passwordVisibility.new ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-700">Confirmar Nueva Contraseña</label>
                <div className="relative">
                  <input
                    type={passwordVisibility.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full p-2 border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-2 top-2 text-gray-600"
                  >
                    {passwordVisibility.confirm ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>
            </div>
            {modalErrorMessage && (
              <div className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
                {modalErrorMessage}
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsChangingPassword(false);
                  setModalErrorMessage("");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Editar Perfil</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Teléfono</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-gray-700">Departamento</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                />
              </div>
            </div>
            {modalErrorMessage && (
              <div className="mt-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
                {modalErrorMessage}
              </div>
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setIsEditingProfile(false);
                  setModalErrorMessage("");
                }}
                className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-[#00684aff] text-white rounded-md hover:bg-[#07835fff] transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
