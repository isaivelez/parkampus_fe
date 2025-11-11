/**
 * Servicio para gestionar alertas masivas
 */

import { API_ENDPOINTS } from '@/constants/api';
import axios from 'axios';

export interface SendAlertData {
  alertType: string;
  message: string;
}

export interface SendAlertResponse {
  success: boolean;
  message: string;
  sentCount?: number;
}

/**
 * Envía una alerta masiva a todos los usuarios (estudiantes y empleados)
 * @param data Datos de la alerta a enviar
 * @returns Respuesta del servidor
 */
export async function sendMassAlert(data: SendAlertData): Promise<SendAlertResponse> {
  try {
    const response = await axios.post<SendAlertResponse>(
      API_ENDPOINTS.SEND_ALERT,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al enviar la alerta');
    }
    throw new Error('Error de conexión. Verifica tu red e intenta nuevamente.');
  }
}

/**
 * Guarda el token de notificación del dispositivo en el servidor
 * @param token Token de Expo Push Notification
 * @param userId ID del usuario
 * @returns Respuesta del servidor
 */
export async function saveNotificationToken(
  token: string,
  userId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(API_ENDPOINTS.SAVE_NOTIFICATION_TOKEN, {
      token,
      userId,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al guardar el token');
    }
    throw new Error('Error de conexión. No se pudo guardar el token de notificación.');
  }
}
