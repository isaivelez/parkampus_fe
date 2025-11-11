# Backend - Sistema de Alertas Masivas

## 📋 Descripción General

Este documento describe los endpoints del backend necesarios para implementar el sistema de alertas masivas en Parkampus. El sistema permite a los celadores enviar notificaciones push a todos los usuarios (estudiantes y empleados) en situaciones que requieren comunicación urgente.

## 🎯 Funcionalidades

1. **Guardar tokens de notificación**: Almacenar los tokens de Expo Push Notifications de cada usuario
2. **Enviar alertas masivas**: Enviar notificaciones push a todos los usuarios (excepto celadores)
3. **Gestión de tokens**: Actualizar tokens cuando cambian de dispositivo

---

## 📡 Endpoints Requeridos

### 1. Guardar Token de Notificación

**Endpoint**: `POST /api/notifications/token`

**Descripción**: Guarda o actualiza el token de Expo Push Notification de un usuario.

**Request Body**:

```json
{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
  "userId": 123
}
```

**Campos**:

- `token` (string, requerido): Token de Expo Push Notification del dispositivo
- `userId` (number, requerido): ID del usuario en la base de datos

**Response Success** (200):

```json
{
  "success": true,
  "message": "Token guardado exitosamente"
}
```

**Response Error** (400):

```json
{
  "success": false,
  "message": "Token o userId inválidos"
}
```

**Response Error** (500):

```json
{
  "success": false,
  "message": "Error al guardar el token"
}
```

**Lógica del Backend**:

```javascript
// Pseudocódigo
async function saveNotificationToken(req, res) {
  const { token, userId } = req.body;

  // Validar datos
  if (!token || !userId) {
    return res.status(400).json({
      success: false,
      message: "Token y userId son requeridos",
    });
  }

  try {
    // Buscar si el usuario ya tiene un token guardado
    const existingToken = await NotificationToken.findOne({ userId });

    if (existingToken) {
      // Actualizar el token existente
      existingToken.token = token;
      existingToken.updatedAt = new Date();
      await existingToken.save();
    } else {
      // Crear un nuevo registro
      await NotificationToken.create({
        userId,
        token,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    res.status(200).json({
      success: true,
      message: "Token guardado exitosamente",
    });
  } catch (error) {
    console.error("Error al guardar token:", error);
    res.status(500).json({
      success: false,
      message: "Error al guardar el token",
    });
  }
}
```

---

### 2. Enviar Alerta Masiva

**Endpoint**: `POST /api/alerts/send`

**Descripción**: Envía una alerta masiva a todos los usuarios de tipo "estudiante" y "empleado" (excluye a los celadores).

**Request Body**:

```json
{
  "alertType": "security",
  "message": "Por motivos de seguridad, le solicitamos de manera urgente desalojar las instalaciones..."
}
```

**Campos**:

- `alertType` (string, requerido): Tipo de alerta. Valores posibles:
  - `"low_availability"`: Pocas celdas disponibles
  - `"security"`: Motivos de seguridad
  - `"mandatory_evacuation"`: Obligatorio desalojar el campus
  - `"night_closure"`: Cierre nocturno de la universidad
- `message` (string, requerido): Mensaje de la alerta a enviar

**Response Success** (200):

```json
{
  "success": true,
  "message": "Alerta enviada exitosamente",
  "sentCount": 45
}
```

**Campos de respuesta**:

- `success` (boolean): Indica si la operación fue exitosa
- `message` (string): Mensaje descriptivo
- `sentCount` (number): Cantidad de notificaciones enviadas

**Response Error** (400):

```json
{
  "success": false,
  "message": "Tipo de alerta o mensaje inválidos"
}
```

**Response Error** (500):

```json
{
  "success": false,
  "message": "Error al enviar las notificaciones"
}
```

**Lógica del Backend**:

```javascript
// Pseudocódigo
const { Expo } = require("expo-server-sdk");

async function sendMassAlert(req, res) {
  const { alertType, message } = req.body;

  // Validar datos
  if (!alertType || !message) {
    return res.status(400).json({
      success: false,
      message: "alertType y message son requeridos",
    });
  }

  try {
    // 1. Obtener todos los usuarios que NO son celadores
    const users = await User.find({
      user_type: { $in: ["estudiante", "empleado"] },
    });

    const userIds = users.map((user) => user._id);

    // 2. Obtener los tokens de notificación de esos usuarios
    const tokens = await NotificationToken.find({
      userId: { $in: userIds },
    });

    // 3. Preparar las notificaciones
    const expo = new Expo();
    const messages = [];

    for (let tokenDoc of tokens) {
      // Validar que el token sea válido para Expo
      if (!Expo.isExpoPushToken(tokenDoc.token)) {
        console.error(`Token inválido: ${tokenDoc.token}`);
        continue;
      }

      messages.push({
        to: tokenDoc.token,
        sound: "default",
        title: "🚨 Alerta Parkampus",
        body: message,
        data: { alertType },
        priority: "high",
      });
    }

    // 4. Enviar las notificaciones en lotes
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (let chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error("Error al enviar lote de notificaciones:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: "Alerta enviada exitosamente",
      sentCount: messages.length,
    });
  } catch (error) {
    console.error("Error al enviar alertas:", error);
    res.status(500).json({
      success: false,
      message: "Error al enviar las notificaciones",
    });
  }
}
```

---

## 🗄️ Modelo de Base de Datos

### Tabla/Colección: `notification_tokens`

```javascript
{
  "_id": ObjectId,
  "userId": Number,          // ID del usuario (referencia a users)
  "token": String,           // Token de Expo Push Notification
  "createdAt": Date,         // Fecha de creación
  "updatedAt": Date          // Fecha de última actualización
}
```

**Índices recomendados**:

- `userId` (único): Para búsquedas rápidas y evitar duplicados
- `createdAt`: Para limpieza de tokens antiguos

**Esquema de Mongoose (ejemplo)**:

```javascript
const notificationTokenSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const NotificationToken = mongoose.model(
  "NotificationToken",
  notificationTokenSchema
);
```

---

## 📦 Dependencias Necesarias

### NPM Packages

```bash
npm install expo-server-sdk
```

### Uso de expo-server-sdk

```javascript
const { Expo } = require("expo-server-sdk");

// Crear una instancia de Expo
const expo = new Expo();

// Validar token
if (Expo.isExpoPushToken(token)) {
  // Token válido
}

// Enviar notificaciones
const messages = [];
for (let pushToken of somePushTokens) {
  if (!Expo.isExpoPushToken(pushToken)) {
    continue;
  }

  messages.push({
    to: pushToken,
    sound: "default",
    title: "Título",
    body: "Mensaje",
    data: { withSome: "data" },
  });
}

// Enviar en lotes
const chunks = expo.chunkPushNotifications(messages);
const tickets = [];

for (let chunk of chunks) {
  try {
    const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
    tickets.push(...ticketChunk);
  } catch (error) {
    console.error(error);
  }
}
```

---

## 🔐 Seguridad y Consideraciones

### 1. Autenticación

- Los endpoints deben estar protegidos con autenticación
- Solo usuarios autenticados pueden guardar su token
- Solo celadores pueden enviar alertas masivas

```javascript
// Middleware de ejemplo
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  // Validar token...
  next();
}

function requireCelador(req, res, next) {
  if (req.user.user_type !== "celador") {
    return res.status(403).json({
      success: false,
      message: "Solo los celadores pueden enviar alertas",
    });
  }
  next();
}

// Aplicar middlewares
app.post("/api/notifications/token", requireAuth, saveNotificationToken);
app.post("/api/alerts/send", requireAuth, requireCelador, sendMassAlert);
```

### 2. Rate Limiting

- Implementar límites de solicitudes para prevenir abuso
- Especialmente importante para el endpoint de alertas

```javascript
const rateLimit = require("express-rate-limit");

const alertLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 alertas por ventana
  message: "Demasiadas alertas enviadas, intenta más tarde",
});

app.post(
  "/api/alerts/send",
  alertLimiter,
  requireAuth,
  requireCelador,
  sendMassAlert
);
```

### 3. Validación de Datos

- Validar que `alertType` sea uno de los valores permitidos
- Sanitizar el mensaje para prevenir inyecciones
- Verificar longitud máxima del mensaje

```javascript
const ALLOWED_ALERT_TYPES = [
  "low_availability",
  "security",
  "mandatory_evacuation",
  "night_closure",
];

function validateAlertData(req, res, next) {
  const { alertType, message } = req.body;

  if (!ALLOWED_ALERT_TYPES.includes(alertType)) {
    return res.status(400).json({
      success: false,
      message: "Tipo de alerta inválido",
    });
  }

  if (!message || message.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Mensaje inválido o muy largo",
    });
  }

  next();
}
```

### 4. Manejo de Errores

- Registrar errores de envío de notificaciones
- Reintentar envíos fallidos
- Limpiar tokens inválidos

### 5. Privacidad

- No almacenar información sensible en los datos de la notificación
- Respetar las preferencias de notificación del usuario

---

## 📊 Logs y Monitoreo

Recomendaciones para logging:

```javascript
// Ejemplo de logs
console.log(`[ALERTS] Alerta ${alertType} enviada a ${sentCount} usuarios`);
console.log(`[TOKENS] Token guardado para usuario ${userId}`);
console.error(`[ERROR] Error al enviar notificación: ${error.message}`);
```

---

## 🧪 Testing

### Endpoint de tokens

```bash
curl -X POST http://localhost:3000/api/notifications/token \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]",
    "userId": 123
  }'
```

### Endpoint de alertas

```bash
curl -X POST http://localhost:3000/api/alerts/send \
  -H "Content-Type: application/json" \
  -d '{
    "alertType": "security",
    "message": "Por motivos de seguridad, le solicitamos desalojar..."
  }'
```

---

## 📱 Integración con Frontend

El frontend ya está configurado para:

1. **Solicitar permisos de notificaciones** al iniciar la app
2. **Obtener el token de Expo** automáticamente
3. **Guardar el token** en el backend cuando se aceptan los permisos
4. **Mostrar interfaz de celador** con botón de "Activar alerta"
5. **Pantalla de confirmación** con opciones predefinidas
6. **Envío de alertas** al backend

### Archivos modificados en el frontend:

- `app/(tabs)/index.tsx` - Gestión de tokens
- `app/(tabs)/explore.tsx` - Vista de celador con botón de alerta
- `app/alert-confirmation.tsx` - Pantalla de confirmación
- `services/alertService.ts` - Servicios de API
- `constants/api.ts` - Endpoints

---

## ✅ Checklist de Implementación Backend

- [ ] Instalar `expo-server-sdk`
- [ ] Crear modelo `NotificationToken` en la base de datos
- [ ] Implementar endpoint `POST /api/notifications/token`
- [ ] Implementar endpoint `POST /api/alerts/send`
- [ ] Agregar middlewares de autenticación
- [ ] Agregar middleware de validación de celador
- [ ] Implementar rate limiting
- [ ] Validar datos de entrada
- [ ] Agregar logs para monitoreo
- [ ] Probar envío de notificaciones con Expo
- [ ] Documentar en README del backend

---

## 🔗 Referencias

- [Expo Push Notifications Documentation](https://docs.expo.dev/push-notifications/overview/)
- [Expo Server SDK](https://github.com/expo/expo-server-sdk-node)
- [Best Practices for Push Notifications](https://docs.expo.dev/push-notifications/push-notifications-setup/)

---

## 💡 Mejoras Futuras

1. **Historial de alertas**: Guardar registro de todas las alertas enviadas
2. **Estadísticas**: Tracking de entrega y apertura de notificaciones
3. **Segmentación**: Enviar alertas solo a ciertos grupos (por ej., solo estudiantes)
4. **Programación**: Programar alertas para envío futuro
5. **Templates**: Plantillas de mensajes personalizables
6. **Confirmación de recepción**: Notificar al celador cuántos usuarios recibieron la alerta
