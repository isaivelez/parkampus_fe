# Parkampus Frontend - Configuración de Notificaciones Push

## 📱 Sistema de Notificaciones en Tiempo Real

Este proyecto está configurado para recibir notificaciones push de forma **síncrona e instantánea** desde el backend de Parkampus cuando un celador crea una alerta o actualiza la disponibilidad de parqueadero.

## 🚀 Características Implementadas

✅ **Recepción en tiempo real** - Las notificaciones llegan instantáneamente cuando son enviadas
✅ **Listeners activos** - La app escucha continuamente nuevas notificaciones
✅ **Manejo en foreground y background** - Recibe notificaciones sin importar el estado de la app
✅ **Contexto global** - Manejo centralizado de notificaciones en toda la app
✅ **Registro automático** - El token se registra automáticamente al iniciar sesión
✅ **Soporte iOS** - Configurado específicamente para simuladores y dispositivos iOS

## 📋 Arquitectura

### 1. NotificationService (`services/NotificationService.ts`)

Servicio que maneja toda la lógica de notificaciones push:

- **registerForPushNotifications(userId)**: Solicita permisos y registra el token en el backend
- **setupNotificationListeners()**: Configura listeners para recibir notificaciones
- **registerTokenInBackend()**: Envía el token al backend vía API
- **showLocalNotification()**: Muestra notificaciones locales de prueba
- **getNotificationHistory()**: Obtiene el historial desde el backend

### 2. NotificationContext (`contexts/NotificationContext.tsx`)

Contexto de React que proporciona:

- `expoPushToken`: Token actual del dispositivo
- `notifications`: Array con historial de notificaciones
- `lastNotification`: Última notificación recibida
- `unreadCount`: Contador de notificaciones no leídas
- `registerForNotifications()`: Función para registrar el usuario
- `markAllAsRead()`: Marcar todas como leídas
- `clearAllNotifications()`: Limpiar historial

### 3. Integración en la App (`app/_layout.tsx`)

El `NotificationProvider` envuelve toda la app para que cualquier componente pueda acceder al contexto:

```tsx
<AuthProvider>
  <NotificationProvider>
    <ThemeProvider>
      {/* App content */}
    </ThemeProvider>
  </NotificationProvider>
</AuthProvider>
```

## 🔧 Configuración Necesaria

### 1. app.json

Ya está configurado con:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.parkampus.app",
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "package": "com.parkampus.app",
      "permissions": ["RECEIVE_BOOT_COMPLETED", "VIBRATE", "NOTIFICATIONS"]
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#2E86AB",
          "mode": "production"
        }
      ]
    ]
  }
}
```

### 2. URL del Backend

En `services/NotificationService.ts`, actualiza la URL según tu entorno:

```typescript
const API_BASE_URL = 'http://192.168.40.67:3000/api';
```

**Opciones:**
- Desarrollo local: `http://localhost:3000/api`
- Red local: `http://TU_IP_LOCAL:3000/api`
- Producción: `https://tu-backend.com/api`

## 📱 Flujo Completo de Notificaciones

### Cuando un usuario abre la app:

1. **Registro del usuario**
   ```tsx
   const { registerForNotifications } = useNotifications();
   
   useEffect(() => {
     if (user) {
       registerForNotifications(user._id);
     }
   }, [user]);
   ```

2. **Solicitud de permisos**
   - iOS muestra un diálogo nativo
   - Usuario acepta o rechaza permisos

3. **Obtención del token**
   - Se genera un `ExponentPushToken[...]`
   - Se envía al backend mediante POST `/api/notifications/register-token`

4. **Activación de listeners**
   - Listener en foreground: Muestra alerta en la app
   - Listener de tap: Maneja cuando el usuario toca la notificación

### Cuando el celador envía una alerta:

1. **Backend recibe la alerta**
   ```bash
   POST /api/notifications/send-to-all
   {
     "title": "⚠️ Alerta de Espacios",
     "message": "Solo quedan 5 espacios disponibles",
     "user_type": "estudiante"
   }
   ```

2. **Backend obtiene tokens**
   - Consulta la BD por todos los usuarios con token activo
   - Filtra por tipo de usuario si se especificó

3. **Envío vía Expo Push Service**
   - Backend usa `expo-server-sdk` para enviar
   - Expo entrega la notificación al dispositivo

4. **Dispositivo recibe la notificación**
   - **App cerrada**: Notificación en el centro de notificaciones
   - **App en background**: Notificación en el centro + badge
   - **App en foreground**: Alerta dentro de la app + sonido

5. **Listeners ejecutan callbacks**
   ```tsx
   const handleNotificationReceived = (notification) => {
     console.log('Nueva notificación:', notification);
     // Actualizar UI, mostrar alerta, etc.
   };
   
   const handleNotificationTapped = (notification) => {
     console.log('Usuario tocó la notificación');
     // Navegar a una pantalla específica
   };
   ```

## 🧪 Cómo Probar

### Opción 1: Desde el Backend

```bash
# Enviar notificación a todos
curl -X POST http://192.168.40.67:3000/api/notifications/send-to-all \
  -H "Content-Type: application/json" \
  -d '{
    "title": "🅿️ Prueba de Notificación",
    "message": "Esta es una notificación de prueba"
  }'
```

### Opción 2: Desde la App (Solo desarrollo)

```tsx
import NotificationService from '@/services/NotificationService';

// Mostrar notificación local
await NotificationService.showLocalNotification(
  '🚀 Prueba Local',
  'Esta es una notificación de prueba',
  { type: 'test' }
);
```

### Opción 3: Desde Expo Go

1. Abre tu app en Expo Go
2. El backend debe estar corriendo
3. Inicia sesión para registrar el token
4. Desde el backend o Postman, envía una notificación
5. Deberías recibirla instantáneamente

## ⚙️ Configuración en iOS

### Para Simuladores:

```bash
# Iniciar app en simulador
npm run ios
```

**Nota**: Los simuladores de iOS **NO soportan notificaciones push reales**. Para probar:
- Usa `showLocalNotification()` para simular
- O prueba en un dispositivo físico

### Para Dispositivos Físicos:

1. **Conecta tu iPhone** vía USB

2. **Abre Xcode**:
   ```bash
   cd ios
   xed .
   ```

3. **Configura tu equipo de desarrollo**:
   - Selecciona tu equipo en "Signing & Capabilities"
   - Cambia el Bundle Identifier si es necesario

4. **Instala en el dispositivo**:
   ```bash
   npx expo run:ios --device
   ```

5. **Habilita notificaciones**:
   - Settings > Parkampus > Notifications > Allow

## 🔔 Tipos de Notificaciones Soportadas

### 1. Broadcast a todos los usuarios
```json
{
  "title": "Nuevo Estacionamiento",
  "message": "Se ha habilitado el Bloque 27"
}
```

### 2. Solo a estudiantes
```json
{
  "title": "Mantenimiento",
  "message": "El estacionamiento estará cerrado mañana",
  "user_type": "estudiante"
}
```

### 3. A usuarios específicos
```json
{
  "user_ids": ["user_id_1", "user_id_2"],
  "title": "Vehículo Bloqueado",
  "message": "Tu vehículo está bloqueando la salida"
}
```

### 4. Con datos adicionales
```json
{
  "title": "Alerta de Espacios",
  "message": "Solo quedan 5 espacios",
  "data": {
    "parking_lot_id": "673f1a2b",
    "available_spaces": 5,
    "type": "alert"
  }
}
```

## 🐛 Troubleshooting

### "No se reciben notificaciones"

1. **Verifica que el backend esté corriendo**:
   ```bash
   curl http://192.168.40.67:3000/health
   ```

2. **Verifica que el token se registró**:
   - Revisa los logs: `console.log('Token:', token)`
   - Verifica en la BD del backend que el usuario tiene `expo_push_token`

3. **Verifica permisos**:
   - iOS: Settings > Parkampus > Notifications
   - Android: Settings > Apps > Parkampus > Notifications

4. **Revisa la consola**:
   - Busca mensajes como "🔔 Nueva notificación recibida"
   - Verifica que no haya errores de red

### "Token inválido"

El token debe tener el formato: `ExponentPushToken[xxxxxxxxxxxxxx]`

Si obtienes un token diferente, verifica:
- Que estés usando `expo-notifications` correctamente
- Que el `projectId` en `app.json` sea correcto (para EAS Build)

### "Funciona en desarrollo pero no en producción"

1. **EAS Build**: Necesitas hacer un build con EAS
   ```bash
   eas build --platform ios
   ```

2. **Certificados**: Asegúrate de tener los certificados de Apple configurados

3. **Modo**: En `app.json`, usa `"mode": "production"` en el plugin de notificaciones

## 📚 Recursos Adicionales

- [Expo Notifications Docs](https://docs.expo.dev/push-notifications/overview/)
- [Expo Push Notifications Tool](https://expo.dev/notifications)
- [Backend API Documentation](../parkampus_be/NOTIFICATIONS_API.md)

## 🎯 Próximos Pasos

- [ ] Agregar pantalla de historial de notificaciones
- [ ] Implementar navegación desde notificaciones
- [ ] Agregar sonidos personalizados
- [ ] Implementar notificaciones programadas
- [ ] Agregar badges personalizados
- [ ] Implementar channels para Android

## 📞 Soporte

Si tienes problemas, verifica:
1. Los logs del backend
2. Los logs de la app (Expo Dev Tools)
3. El estado de la red (misma WiFi)
4. Los permisos del dispositivo

---

**¡Listo!** Tu app ahora puede recibir notificaciones push en tiempo real 🚀
