import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// URL base del backend - CAMBIAR A TU IP LOCAL O SERVIDOR
const API_BASE_URL = 'http://192.168.40.67:3000/api';

/**
 * Configurar el comportamiento de las notificaciones cuando se reciben
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  /**
   * Registrar push token para notificaciones
   * @param {string} userId - ID del usuario en el backend
   * @returns {Promise<string|null>} Token de Expo Push o null si falla
   */
  static async registerForPushNotifications(userId) {
    try {
      // Verificar si es un dispositivo físico
      if (!Device.isDevice) {
        console.warn('⚠️ Las notificaciones push solo funcionan en dispositivos físicos');
        // En desarrollo/simulador, retornamos un token de prueba
        if (__DEV__) {
          console.log('🔧 Modo desarrollo: usando token de prueba');
          return 'ExponentPushToken[SIMULATOR_TEST_TOKEN]';
        }
        return null;
      }

      // Solicitar permisos
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.error('❌ Permiso de notificaciones denegado');
        alert('Se necesitan permisos de notificación para recibir alertas de estacionamiento');
        return null;
      }

      // Obtener el token de Expo Push
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      let token;
      try {
        token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
      } catch (error) {
        // Si falla con projectId, intentar sin él (para desarrollo)
        console.warn('⚠️ Error con projectId, intentando sin él:', error.message);
        token = (await Notifications.getExpoPushTokenAsync()).data;
      }

      console.log('📱 Token de notificaciones obtenido:', token);

      // Registrar el token en el backend
      if (userId) {
        await this.registerTokenInBackend(userId, token);
      }

      // Configurar canal de notificaciones para Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'Alertas de Parkampus',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    } catch (error) {
      console.error('❌ Error al registrar notificaciones push:', error);
      return null;
    }
  }

  /**
   * Registrar token en el backend
   * @param {string} userId - ID del usuario
   * @param {string} token - Token de Expo Push
   */
  static async registerTokenInBackend(userId, token) {
    try {
      console.log(`📤 Registrando token en backend para usuario: ${userId}`);

      const response = await fetch(`${API_BASE_URL}/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          expo_push_token: token,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log('✅ Token registrado exitosamente en el backend');
        return data;
      } else {
        console.error('❌ Error al registrar token:', data.message);
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('❌ Error al comunicarse con el backend:', error);
      throw error;
    }
  }

  /**
   * Configurar listeners para recibir notificaciones
   * @param {Function} onNotificationReceived - Callback cuando se recibe una notificación
   * @param {Function} onNotificationTapped - Callback cuando se toca una notificación
   * @returns {Object} Objeto con funciones para remover los listeners
   */
  static setupNotificationListeners(onNotificationReceived, onNotificationTapped) {
    // Listener para cuando llega una notificación (app en foreground)
    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('🔔 Notificación recibida:', notification);
      
      const { title, body, data } = notification.request.content;
      
      if (onNotificationReceived) {
        onNotificationReceived({
          title,
          message: body,
          data,
          notification,
        });
      }
    });

    // Listener para cuando el usuario toca una notificación
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notificación tocada:', response);
      
      const { title, body, data } = response.notification.request.content;
      
      if (onNotificationTapped) {
        onNotificationTapped({
          title,
          message: body,
          data,
          response,
        });
      }
    });

    // Retornar función para limpiar los listeners
    return {
      remove: () => {
        Notifications.removeNotificationSubscription(notificationListener);
        Notifications.removeNotificationSubscription(responseListener);
      },
      notificationListener,
      responseListener,
    };
  }

  /**
   * Mostrar notificación local (para pruebas)
   * @param {string} title - Título de la notificación
   * @param {string} message - Mensaje de la notificación
   * @param {Object} data - Datos adicionales
   */
  static async showLocalNotification(title, message, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: message,
          data,
          sound: true,
        },
        trigger: null, // Mostrar inmediatamente
      });
    } catch (error) {
      console.error('❌ Error al mostrar notificación local:', error);
    }
  }

  /**
   * Obtener historial de notificaciones del backend
   * @param {string} userId - ID del usuario (opcional)
   * @returns {Promise<Array>} Array de notificaciones
   */
  static async getNotificationHistory(userId = null) {
    try {
      const url = userId
        ? `${API_BASE_URL}/notifications?user_id=${userId}`
        : `${API_BASE_URL}/notifications`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('❌ Error al obtener historial de notificaciones:', error);
      throw error;
    }
  }

  /**
   * Cancelar todas las notificaciones programadas
   */
  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🗑️ Todas las notificaciones programadas han sido canceladas');
    } catch (error) {
      console.error('❌ Error al cancelar notificaciones:', error);
    }
  }

  /**
   * Obtener badge count actual
   * @returns {Promise<number>}
   */
  static async getBadgeCount() {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      console.error('❌ Error al obtener badge count:', error);
      return 0;
    }
  }

  /**
   * Establecer badge count
   * @param {number} count - Número a mostrar en el badge
   */
  static async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('❌ Error al establecer badge count:', error);
    }
  }

  /**
   * Limpiar badge count
   */
  static async clearBadgeCount() {
    try {
      await Notifications.setBadgeCountAsync(0);
      console.log('✅ Badge count limpiado');
    } catch (error) {
      console.error('❌ Error al limpiar badge count:', error);
    }
  }
}

export default NotificationService;
