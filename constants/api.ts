/**
 * Configuración del API
 * Centraliza las URLs y endpoints del backend
 */

// URL base del API
// Para desarrollo local en dispositivos físicos o emuladores, usa la IP de tu máquina
// Ejemplo: export const API_BASE_URL = 'http://192.168.1.100:3000';
export const API_BASE_URL = "http://localhost:3000";

// Endpoints
export const API_ENDPOINTS = {
  // Usuarios
  REGISTER: `${API_BASE_URL}/api/users`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,

  // Celdas
  CELDAS: `${API_BASE_URL}/api/celdas`,

  // Notificaciones
  NOTIFICACIONES: `${API_BASE_URL}/api/notificaciones`,
};

// Configuración de timeout
export const API_TIMEOUT = 10000; // 10 segundos
