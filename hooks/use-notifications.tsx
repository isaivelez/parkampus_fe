import { useState, useEffect, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import api from '../services/api';
import { API_ENDPOINTS } from '@/constants/api';

// Configuración del handler de notificaciones para cuando la app está en primer plano
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const useNotifications = () => {
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
    const notificationListener = useRef<Notifications.EventSubscription | null>(null);
    const responseListener = useRef<Notifications.EventSubscription | null>(null);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token);
            if (token) {
                sendTokenToBackend(token);
            }
        });

        // Listener para notificaciones en primer plano
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
            // Mostrar alerta como pidió el usuario
            const title = notification.request.content.title || 'Notificación';
            const body = notification.request.content.body || '';
            Alert.alert(title, body, [{ text: 'OK' }]);
        });

        // Listener para cuando el usuario toca la notificación
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Notificación tocada:', response);
        });

        return () => {
            if (notificationListener.current) {
                notificationListener.current.remove();
            }
            if (responseListener.current) {
                responseListener.current.remove();
            }
        };
    }, []);

    const sendTokenToBackend = async (token: string) => {
        try {
            await api.post(API_ENDPOINTS.UPDATE_TOKEN, { expoPushToken: token });
            console.log('Token enviado al backend exitosamente');
        } catch (error) {
            console.error('Error enviando token al backend:', error);
        }
    };

    return {
        expoPushToken,
        notification,
    };
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert('Error', 'Se requieren permisos para recibir notificaciones push.');
            return;
        }

        // Obtener el token
        try {
            const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
            if (!projectId) {
                console.warn('No se encontró projectId en la configuración de Expo. Intentando obtener token sin projectId...');
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            token = tokenData.data;
            console.log('Expo Push Token:', token);
        } catch (e) {
            console.error('Error obteniendo push token:', e);
        }
    } else {
        console.log('Las notificaciones push requieren un dispositivo físico.');
    }

    return token;
}
