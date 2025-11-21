import {
    API_BASE_URL as ENV_API_BASE_URL,
    API_TIMEOUT as ENV_API_TIMEOUT,
} from "@env";

/**
 * Configuración del API
 * Centraliza las URLs y endpoints del backend
 * Usa variables de entorno del archivo .env
 */

// URL base del API desde las variables de entorno
// Para desarrollo local en dispositivos físicos, configura la IP en el archivo .env
// IMPORTANTE: Tu dispositivo móvil debe estar en la misma red WiFi que tu computadora
export const API_BASE_URL = ENV_API_BASE_URL || "http://192.168.40.36:3000";

// Endpoints
export const API_ENDPOINTS = {
    // Usuarios
    REGISTER: "/api/users",

    // AUTH
    LOGIN: "/api/login",

    // Parking Lots
    PARKING_LOTS: "/api/parking-lots",

    // Notificaciones
    NOTIFICACIONES: "/api/notificaciones",
};

// Configuración de timeout desde variables de entorno
export const API_TIMEOUT = parseInt(ENV_API_TIMEOUT || "10000", 10); // 10 segundos por defecto
