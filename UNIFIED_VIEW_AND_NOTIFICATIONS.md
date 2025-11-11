# Actualización de Vista y Notificaciones Push

## 📊 Cambio 1: Vista Unificada para Todos los Usuarios

### ✨ Lo que cambió

Anteriormente, **estudiantes y empleados** veían una lista de celdas hardcodeadas. Ahora **todos los usuarios** (estudiantes, empleados y celadores) ven la misma información de disponibilidad de parqueadero.

### 🎯 Nueva Vista para Estudiantes/Empleados

Ahora muestran:

1. **📊 Cards de Disponibilidad Total**

   - Card "Para Carro" 🚗 con total disponible
   - Card "Para Moto" 🏍️ con total disponible
   - Colores dinámicos según disponibilidad

2. **📍 Leyenda de Colores**

   - 🔴 Rojo: < 10 espacios
   - 🟠 Naranja: 10-20 espacios
   - 🟢 Verde: > 20 espacios

3. **🏢 Detalle por Estacionamiento**
   - Lista completa de todos los parking lots
   - **SOLO LECTURA** (sin botón de actualizar)
   - Disponibilidad de carros y motos por cada uno

### 🔄 Diferencias por Tipo de Usuario

| Característica                | Celador | Estudiante/Empleado |
| ----------------------------- | ------- | ------------------- |
| Cards de disponibilidad total | ✅ Sí   | ✅ Sí               |
| Leyenda de colores            | ✅ Sí   | ✅ Sí               |
| Detalle por estacionamiento   | ✅ Sí   | ✅ Sí               |
| Botón "✏️ Actualizar"         | ✅ Sí   | ❌ No               |
| Edición inline                | ✅ Sí   | ❌ No               |
| Pull to refresh               | ✅ Sí   | ✅ Sí               |

### 📱 Vista de Estudiante/Empleado

```
┌─────────────────────────────────────┐
│ Disponibilidad de Parqueadero       │
│ Estado actual                       │
│                                     │
│  ┌──────────┐    ┌──────────┐      │
│  │   🚗     │    │   🏍️    │      │
│  │ Para     │    │ Para     │      │
│  │ Carro    │    │ Moto     │      │
│  │   96     │    │   120    │      │
│  └──────────┘    └──────────┘      │
│                                     │
│  Indicadores:                       │
│  🔴 < 10  🟠 10-20  🟢 >20         │
│                                     │
│  Detalle por estacionamiento        │
│  ┌───────────────────────────┐     │
│  │ Estacionamiento Bloque 27 │     │
│  │  🚗 50    🏍️ 20          │     │
│  └───────────────────────────┘     │
│                                     │
│  (Sin botón de actualizar)          │
└─────────────────────────────────────┘
```

### 📁 Cambios en el código

#### Eliminado:

- ❌ Datos hardcodeados de `celdas`
- ❌ Funciones `getEstadoColor()` y `getEstadoText()`
- ❌ Estilos: `statsContainer`, `statItem`, `celdasContainer`, `celdaCard`, `celdaHeader`, etc.

#### Modificado:

- ✅ `fetchParkingLots()` se ejecuta para todos los usuarios
- ✅ `renderDefaultView()` ahora muestra las mismas cards que celador
- ✅ Solo celadores ven el botón "✏️ Actualizar"

---

## 🔔 Cambio 2: Solicitud de Permisos para Notificaciones Push

### ✨ Funcionalidad Implementada

Se agregó la capacidad de solicitar permisos al usuario para recibir **notificaciones push** sobre la disponibilidad del parqueadero.

### 🎯 Comportamiento

1. **Al abrir la app** por primera vez
2. Espera **2 segundos** después de cargar
3. Muestra el **diálogo nativo del sistema** para solicitar permisos
4. Guarda en **AsyncStorage** que ya se solicitó (no vuelve a preguntar)

### 📱 Flujos de Usuario

#### Caso 1: Usuario Acepta

```
1. App carga → Espera 2 segundos
2. Sistema muestra: "Parkampus quiere enviarte notificaciones"
3. Usuario toca "Permitir"
4. Alert: "🔔 Notificaciones activadas"
   "Recibirás notificaciones sobre la disponibilidad del parqueadero"
5. Se guarda en AsyncStorage: notificationPermissionAsked = true
```

#### Caso 2: Usuario Rechaza

```
1. App carga → Espera 2 segundos
2. Sistema muestra: "Parkampus quiere enviarte notificaciones"
3. Usuario toca "No permitir"
4. Alert: "⚠️ Notificaciones desactivadas"
   "Puedes activarlas más tarde desde la configuración de tu dispositivo"
5. Se guarda en AsyncStorage: notificationPermissionAsked = true
```

#### Caso 3: Ya se Solicitó Antes

```
1. App carga → Verifica AsyncStorage
2. Si notificationPermissionAsked = true
3. NO vuelve a solicitar permisos
```

### 🔧 Implementación Técnica

#### Librería instalada:

```bash
npm install expo-notifications
```

#### Handler de notificaciones:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
```

#### Función de solicitud:

```typescript
const requestNotificationPermissions = async () => {
  // 1. Verificar si ya se pidieron antes
  const hasAsked = await AsyncStorage.getItem("notificationPermissionAsked");
  if (hasAsked === "true") return;

  // 2. Obtener estado actual
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  // 3. Solicitar permisos si no están otorgados
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
  }

  // 4. Guardar que ya se pidieron
  await AsyncStorage.setItem("notificationPermissionAsked", "true");

  // 5. Mostrar feedback al usuario
};
```

#### Llamada en useEffect:

```typescript
useEffect(() => {
  fetchParkingLots();

  const timer = setTimeout(() => {
    if (!notificationPermissionAsked) {
      requestNotificationPermissions();
    }
  }, 2000);

  return () => clearTimeout(timer);
}, []);
```

### 🎨 Configuración de Comportamiento

Las notificaciones están configuradas para:

- ✅ **Mostrar alerta** cuando la app está abierta
- ✅ **Reproducir sonido**
- ✅ **Mostrar badge** (contador en el ícono)
- ✅ **Mostrar banner** en iOS
- ✅ **Mostrar en lista** de notificaciones

### 📝 Estado Persistente

Se usa `AsyncStorage` para guardar:

- **Key**: `notificationPermissionAsked`
- **Value**: `"true"` o `undefined`
- **Propósito**: Evitar solicitar permisos múltiples veces

### 🧪 Testing

#### Probar primera vez:

1. Desinstalar la app del dispositivo
2. Reinstalar y abrir
3. Esperar 2 segundos
4. Debe aparecer el diálogo de permisos del sistema

#### Probar que no vuelve a pedir:

1. Cerrar y reabrir la app
2. NO debe volver a aparecer el diálogo

#### Resetear para probar de nuevo:

```typescript
// En el código, antes de la función requestNotificationPermissions:
await AsyncStorage.removeItem("notificationPermissionAsked");
```

O desde el dispositivo:

- iOS: Configuración > General > Restablecer > Restablecer ubicación y privacidad
- Android: Configuración > Apps > Parkampus > Permisos > Restablecer

### 🔒 Permisos por Plataforma

#### iOS:

- Requiere configuración en `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSUserNotificationCenterUsageDescription": "Esta app usa notificaciones para informarte sobre la disponibilidad del parqueadero"
      }
    }
  }
}
```

#### Android:

- Permisos automáticos en Android < 13
- Android 13+ requiere solicitud explícita (ya implementada)

### 📊 Estados del Permiso

| Estado         | Descripción                    |
| -------------- | ------------------------------ |
| `granted`      | Usuario aceptó notificaciones  |
| `denied`       | Usuario rechazó notificaciones |
| `undetermined` | Usuario no ha decidido aún     |

### 🚀 Próximos Pasos (Opcional)

Con los permisos ya configurados, se puede:

1. **Enviar notificaciones locales** cuando la disponibilidad sea baja
2. **Configurar push notifications** desde el backend
3. **Notificar cambios importantes** en tiempo real
4. **Recordatorios** de disponibilidad

### 📁 Archivos Modificados

1. **`app/(tabs)/index.tsx`**:

   - Import de `expo-notifications`
   - Import de `AsyncStorage`
   - Handler de notificaciones
   - Estado `notificationPermissionAsked`
   - Función `requestNotificationPermissions()`
   - useEffect con timer

2. **`package.json`**:
   - Dependencia: `expo-notifications`

---

## 🎉 Resumen de Cambios

### ✅ Vista Unificada

- Todos los usuarios ven disponibilidad total
- Solo celadores pueden editar
- Pull to refresh para todos

### ✅ Notificaciones Push

- Solicitud de permisos al abrir la app
- Solo se pide una vez (guardado en AsyncStorage)
- Feedback visual al usuario
- Configuración completa del handler

### 📦 Dependencias Instaladas

```bash
npm install expo-notifications
```

### 🧪 Para Probar

1. Login con cualquier tipo de usuario
2. Ver las cards de disponibilidad
3. Esperar 2 segundos para el diálogo de permisos
4. Aceptar o rechazar notificaciones
5. Verificar que no vuelve a preguntar al reabrir
