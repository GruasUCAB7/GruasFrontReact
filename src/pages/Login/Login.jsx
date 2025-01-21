import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import apiInstance from "../../services/apiService";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const userId = decodedToken.sub;
                localStorage.setItem("userId", userId);
                navigate("/AdminHome");
            } catch (error) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userId");
            }
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();

        setErrorMessage("");

        try {
            const response = await apiInstance.post("/api/Auth/login", { email, password });

            if (response.data.requiresPasswordChange) {
                const limitedToken = response.data.limitedToken;

                localStorage.setItem("limitedToken", limitedToken);

                navigate("/ChangePassword", {
                    state: { email, temporaryPassword: password },
                });
            } else if (response.data.token) {

                localStorage.setItem("authToken", response.data.token);

                navigate("/AdminHome");
            } else {
                setErrorMessage("No se pudo iniciar sesión. Verifica tus datos.");
            }
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Email o contraseña incorrectos. Inténtalo nuevamente."
            );
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-4">
                    Bienvenido a Gruas UCAB
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Inicia sesión para continuar
                </p>

                {errorMessage && (
                    <div className="text-sm text-red-600 bg-red-100 p-3 rounded-md mb-4">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00684aff]"
                            placeholder="Ingresa tu correo"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00684aff]"
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#00684aff] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#07835fff] transition"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                <div className="mt-4 text-sm text-center">
                    <p className="text-gray-600">
                        ¿Olvidaste tu contraseña?{" "}
                        <a
                            href="/forgot-password"
                            className="text-[#00684aff] hover:underline"
                        >
                            Restablecer contraseña
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;