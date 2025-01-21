import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiInstance from "../../services/apiService";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";


const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { state } = useLocation();
    const navigate = useNavigate();

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            setSuccessMessage("");
            return;
        }

        try {
            await apiInstance.post("/api/Auth/change-password", {
                email: state?.email,
                oldPassword: state?.temporaryPassword,
                newPassword,
            });

            setSuccessMessage("Contraseña cambiada exitosamente. Inicia sesión nuevamente. Regresando al inicio...");
            setErrorMessage("");

            setTimeout(() => navigate("/Login"), 2000);
        } catch (error) {
            console.error("Error al cambiar contraseña:", error.response?.data || error.message);
            setErrorMessage(
                error.response?.data?.message || "Error al cambiar contraseña. Intenta nuevamente."
            );
            setSuccessMessage("");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Cambiar Contraseña
                </h1>

                {successMessage && (
                    <div className="text-sm text-green-600 bg-green-100 p-3 rounded-md mb-4 border border-green-400">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md mb-4 border border-red-400">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00684aff]"
                            placeholder="Ingresa tu nueva contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute top-1/2 transform -translate-y-[2%] right-3 flex items-center justify-center h-5 w-5 text-gray-500 focus:outline-none"
                        >
                            {showNewPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>


                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                            Confirmar Nueva Contraseña
                        </label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00684aff]"
                            placeholder="Confirma tu nueva contraseña"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute top-1/2 transform -translate-y-[2%] right-3 flex items-center justify-center h-5 w-5 text-gray-500 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}

                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#00684aff] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#07835fff] transition"
                    >
                        Cambiar Contraseña
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
