/**
 * Servicio de usuarios
 * Maneja todas las peticiones relacionadas con usuarios
 */

import axios from "axios";
import { API_ENDPOINTS } from "@/constants/api";
import api from "./api";

// Tipos
export interface RegisterUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    user_type: "celador" | "estudiante" | "empleado";
}

export interface RegisterUserResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        user_type: string;
    };
}

export interface LoginUserData {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_type: "celador" | "estudiante" | "empleado";
    created_at: string;
    updated_at: string;
}

export interface LoginUserResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        user: User;
    };
}

export interface ApiError {
    message: string;
    status?: number;
}

/**
 * Registra un nuevo usuario en el sistema
 */
export const registerUser = async (
    data: RegisterUserData
): Promise<RegisterUserResponse> => {
    try {
        const response = await api.post<RegisterUserResponse>(
            API_ENDPOINTS.REGISTER,
            data
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // El servidor respondió con un error
                throw {
                    message:
                        error.response.data?.message ||
                        error.response.data?.error ||
                        `Error del servidor: ${error.response.status}`,
                    status: error.response.status,
                } as ApiError;
            } else if (error.request) {
                // La petición se hizo pero no hubo respuesta
                throw {
                    message: "No se pudo conectar con el servidor. Verifica tu conexión.",
                } as ApiError;
            }
        }

        // Error desconocido
        throw {
            message: "Ocurrió un error inesperado. Intenta de nuevo.",
        } as ApiError;
    }
};

/**
 * Inicia sesión de un usuario
 */
export const loginUser = async (
    data: LoginUserData
): Promise<LoginUserResponse> => {
    try {
        const response = await api.post<LoginUserResponse>(
            API_ENDPOINTS.LOGIN,
            data
        );

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                // El servidor respondió con un error
                throw {
                    message:
                        error.response.data?.message ||
                        error.response.data?.error ||
                        "Credenciales incorrectas",
                    status: error.response.status,
                } as ApiError;
            } else if (error.request) {
                // La petición se hizo pero no hubo respuesta
                throw {
                    message: "No se pudo conectar con el servidor. Verifica tu conexión.",
                } as ApiError;
            }
        }

        // Error desconocido
        throw {
            message: "Ocurrió un error inesperado. Intenta de nuevo.",
        } as ApiError;
    }
};

/**
 * Valida si un email ya está registrado
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
        const response = await api.get(`${API_ENDPOINTS.REGISTER}/check-email`, {
            params: { email },
        });

        return response.data.exists;
    } catch (error) {
        console.error("Error checking email:", error);
        return false;
    }
};
