# Configuración del API

## URL del Backend

Para que la aplicación se conecte correctamente al backend, necesitas configurar la URL en el archivo `constants/api.ts`.

### Desarrollo Local

#### En Emulador iOS

```typescript
export const API_BASE_URL = "http://localhost:3000";
```

#### En Emulador Android

```typescript
export const API_BASE_URL = "http://10.0.2.2:3000";
```

#### En Dispositivo Físico

Usa la IP de tu computadora en la red local:

```typescript
export const API_BASE_URL = "http://192.168.1.XXX:3000";
```

Para encontrar tu IP:

- **macOS/Linux**: `ifconfig | grep "inet "`
- **Windows**: `ipconfig`

### Testing con Expo Go

Si estás usando Expo Go, tu dispositivo y computadora deben estar en la misma red WiFi. Usa la IP local de tu computadora.

### Producción

Para producción, reemplaza con la URL de tu servidor:

```typescript
export const API_BASE_URL = "https://api.tuparkampus.com";
```

## Endpoints Disponibles

- `POST /api/users` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `GET /api/celdas` - Obtener celdas de parqueo
- `GET /api/notificaciones` - Obtener notificaciones

## Troubleshooting

### Error: "Network request failed"

- Verifica que el backend esté corriendo
- Verifica que la URL sea correcta para tu entorno
- En Android, usa `10.0.2.2` en lugar de `localhost`
- En dispositivos físicos, asegúrate de estar en la misma red WiFi

### Error: "Cannot connect to server"

- Verifica que no haya firewall bloqueando la conexión
- Asegúrate de que el puerto 3000 esté accesible
- En dispositivos físicos, verifica que ambos estén en la misma red
