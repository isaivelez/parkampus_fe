import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import NotificationService from '../services/NotificationService';

const NotificationContext = createContext({});

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [lastNotification, setLastNotification] = useState(null);
  const notificationListeners = useRef(null);

  useEffect(() => {
    // Configurar listeners de notificaciones
    setupNotifications();

    // Limpiar listeners al desmontar
    return () => {
      if (notificationListeners.current) {
        notificationListeners.current.remove();
      }
    };
  }, []);

  const setupNotifications = () => {
    // Configurar listeners para recibir notificaciones
    notificationListeners.current = NotificationService.setupNotificationListeners(
      handleNotificationReceived,
      handleNotificationTapped
    );
  };

  /**
   * Registrar usuario para recibir notificaciones push
   * @param {string} userId - ID del usuario en el backend
   */
  const registerForNotifications = async (userId) => {
    try {
      const token = await NotificationService.registerForPushNotifications(userId);
      
      if (token) {
        setExpoPushToken(token);
        console.log('✅ Usuario registrado para notificaciones push');
        
        // Mostrar notificación de bienvenida
        if (Platform.OS !== 'web') {
          await NotificationService.showLocalNotification(
            '🚀 ¡Bienvenido a Parkampus!',
            'Recibirás notificaciones sobre disponibilidad de estacionamiento',
            { type: 'welcome' }
          );
        }
        
        return token;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error al registrar para notificaciones:', error);
      Alert.alert(
        'Error',
        'No se pudieron configurar las notificaciones. Por favor, verifica los permisos.'
      );
      return null;
    }
  };

  /**
   * Handler cuando se recibe una notificación (app en foreground)
   */
  const handleNotificationReceived = (notificationData) => {
    console.log('🔔 Nueva notificación recibida:', notificationData);
    
    const newNotification = {
      id: Date.now().toString(),
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
      timestamp: new Date(),
      read: false,
    };

    // Agregar a la lista de notificaciones
    setNotifications((prev) => [newNotification, ...prev]);
    setLastNotification(newNotification);

    // Mostrar alerta en la app (opcional, ya que la notificación se muestra automáticamente)
    // Si quieres un comportamiento personalizado, puedes descomentar esto:
    /*
    Alert.alert(
      notificationData.title,
      notificationData.message,
      [
        { text: 'Cerrar', style: 'cancel' },
        {
          text: 'Ver',
          onPress: () => handleNotificationTapped(notificationData),
        },
      ]
    );
    */
  };

  /**
   * Handler cuando el usuario toca una notificación
   */
  const handleNotificationTapped = (notificationData) => {
    console.log('👆 Usuario tocó la notificación:', notificationData);
    
    setLastNotification({
      ...notificationData,
      tapped: true,
    });

    // Aquí puedes agregar lógica de navegación basada en el tipo de notificación
    const { data } = notificationData;
    
    if (data && data.type) {
      switch (data.type) {
        case 'alert':
          console.log('📍 Navegar a alertas');
          // Ejemplo: navigation.navigate('Alerts', { alertId: data.alertId });
          break;
        case 'parking_lot':
          console.log('🅿️ Navegar a estacionamiento:', data.parking_lot_id);
          // Ejemplo: navigation.navigate('ParkingLot', { id: data.parking_lot_id });
          break;
        case 'reservation':
          console.log('📅 Navegar a reservaciones');
          // Ejemplo: navigation.navigate('Reservations');
          break;
        default:
          console.log('📱 Notificación general');
      }
    }

    // Marcar notificación como leída
    markNotificationAsRead(notificationData.id || Date.now().toString());
  };

  /**
   * Marcar notificación como leída
   */
  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  /**
   * Marcar todas las notificaciones como leídas
   */
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
    NotificationService.clearBadgeCount();
  };

  /**
   * Limpiar todas las notificaciones
   */
  const clearAllNotifications = () => {
    setNotifications([]);
    setLastNotification(null);
    NotificationService.clearBadgeCount();
  };

  /**
   * Obtener número de notificaciones no leídas
   */
  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const value = {
    expoPushToken,
    notifications,
    lastNotification,
    unreadCount: getUnreadCount(),
    registerForNotifications,
    markNotificationAsRead,
    markAllAsRead,
    clearAllNotifications,
    handleNotificationReceived,
    handleNotificationTapped,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
