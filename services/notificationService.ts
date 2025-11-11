/**
 * Servicio de Notificaciones Push
 * Maneja la recepción y procesamiento de notificaciones en tiempo real
 */

import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import { router } from 'expo-router';

// Tipos de alertas que pueden recibirse
export type AlertType = 
  | 'low_availability' 
  | 'security' 
  | 'mandatory_evacuation' 
  | 'night_closure';

// Estructura de datos de una notificación de alerta
export interface AlertNotificationData extends Record<string, unknown> {
  alertType?: AlertType;
  message?: string;
  timestamp?: string;
}

/**
 * Obtiene y retorna el token de Expo Push Notification
 * @param projectId ID del proyecto en Expo
 * @returns Token de notificación o null si hay error
 */
export async function getExpoPushToken(projectId: string): Promise<string | null> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Si no tiene permisos, pedirlos
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Si no se otorgaron permisos, retornar null
    if (finalStatus !== 'granted') {
      console.log('Permisos de notificación no otorgados');
      return null;
    }

    // Obtener el token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return tokenData.data;
  } catch (error) {
    console.error('Error al obtener token de notificación:', error);
    return null;
  }
}

/**
 * Maneja una notificación recibida mientras la app está en primer plano
 * @param notification Notificación recibida
 */
export function handleNotificationReceived(notification: Notifications.Notification) {
  const data = notification.request.content.data as AlertNotificationData;
  
  console.log('📱 Notificación recibida:', {
    title: notification.request.content.title,
    body: notification.request.content.body,
    data,
  });

  // Si es una alerta de tipo crítico, mostrar alerta inmediata
  if (data.alertType === 'security' || data.alertType === 'mandatory_evacuation') {
    Alert.alert(
      notification.request.content.title || '🚨 Alerta Importante',
      notification.request.content.body || '',
      [
        {
          text: 'Entendido',
          style: 'default',
        },
      ],
      { cancelable: false }
    );
  }
}

/**
 * Maneja cuando el usuario interactúa con una notificación (tap/click)
 * @param response Respuesta de la interacción con la notificación
 */
export function handleNotificationResponse(
  response: Notifications.NotificationResponse
) {
  const data = response.notification.request.content.data as AlertNotificationData;
  
  console.log('👆 Usuario interactuó con notificación:', {
    actionIdentifier: response.actionIdentifier,
    data,
  });

  // Navegar a la pantalla de notificaciones
  try {
    router.push('/(tabs)/explore');
  } catch (error) {
    console.error('Error al navegar:', error);
  }
}

/**
 * Configura los listeners de notificaciones para la app
 * Debe llamarse en el componente raíz de la aplicación
 * 
 * @returns Función de limpieza para remover los listeners
 */
export function setupNotificationListeners(): () => void {
  // Listener para notificaciones recibidas mientras la app está activa
  const receivedSubscription = Notifications.addNotificationReceivedListener(
    handleNotificationReceived
  );

  // Listener para cuando el usuario toca una notificación
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(
    handleNotificationResponse
  );

  // Retornar función de limpieza
  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}

/**
 * Muestra una notificación local (para testing)
 * @param title Título de la notificación
 * @param body Cuerpo del mensaje
 * @param data Datos adicionales
 */
export async function showLocalNotification(
  title: string,
  body: string,
  data?: AlertNotificationData
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger: null, // Mostrar inmediatamente
  });
}

/**
 * Obtiene todas las notificaciones pendientes
 */
export async function getPendingNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

/**
 * Cancela todas las notificaciones pendientes
 */
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

/**
 * Obtiene el badge count actual
 */
export async function getBadgeCount(): Promise<number> {
  return await Notifications.getBadgeCountAsync();
}

/**
 * Establece el badge count
 * @param count Número a mostrar en el badge
 */
export async function setBadgeCount(count: number) {
  await Notifications.setBadgeCountAsync(count);
}

/**
 * Limpia el badge count
 */
export async function clearBadge() {
  await Notifications.setBadgeCountAsync(0);
}
