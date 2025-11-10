# 🧪 Testing del Formulario de Registro

## Configuración Previa

### 1. Verificar que el backend esté corriendo

Asegúrate de que tu servidor backend esté ejecutándose en `http://localhost:3000`

```bash
# En tu proyecto backend
npm start
# o
node server.js
```

### 2. Configurar la URL del API

Si estás probando en un dispositivo físico o emulador Android, edita el archivo `constants/api.ts`:

**Para iOS Simulator:**

```typescript
export const API_BASE_URL = "http://localhost:3000";
```

**Para Android Emulator:**

```typescript
export const API_BASE_URL = "http://10.0.2.2:3000";
```

**Para Dispositivo Físico:**

```typescript
export const API_BASE_URL = "http://TU_IP_LOCAL:3000";
```

Para encontrar tu IP local:

- Mac/Linux: `ifconfig | grep "inet "`
- Windows: `ipconfig`

## Probar el Registro

### Datos de prueba válidos:

```json
{
  "nombre": "Juan",
  "apellido": "Pérez García",
  "correo": "juan.perez@pascualbravo.edu.co",
  "password": "Test1234!",
  "confirmPassword": "Test1234!",
  "rol": "estudiante"
}
```

### Validaciones del formulario:

**Nombre y Apellido:**

- ✅ Requeridos
- ✅ Mínimo 2 caracteres

**Correo institucional:**

- ✅ Requerido
- ✅ Debe terminar en `@pascualbravo.edu.co`
- ✅ Formato de email válido

**Rol:**

- ✅ Requerido
- ✅ Opciones: Celador, Estudiante, Empleado

**Contraseña:**

- ✅ Requerida
- ✅ Mínimo 8 caracteres
- ✅ Al menos una letra mayúscula
- ✅ Al menos una letra minúscula
- ✅ Al menos un número
- ✅ Al menos un carácter especial (!@#$%^&\*(),.?":{}|<>)

**Confirmar Contraseña:**

- ✅ Requerida
- ✅ Debe coincidir con la contraseña

## Estructura del Request

El formulario envía al endpoint `POST http://localhost:3000/api/users`:

```json
{
  "first_name": "Juan",
  "last_name": "Pérez García",
  "email": "juan.perez@pascualbravo.edu.co",
  "password": "Test1234!",
  "user_type": "estudiante"
}
```

## Respuestas Esperadas

### Éxito (200/201):

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "123",
    "email": "juan.perez@pascualbravo.edu.co",
    "first_name": "Juan",
    "last_name": "Pérez García",
    "user_type": "estudiante"
  }
}
```

### Error (400/500):

```json
{
  "success": false,
  "message": "El correo ya está registrado",
  "error": "DUPLICATE_EMAIL"
}
```

## Mensajes de Error

La aplicación muestra diferentes mensajes según el tipo de error:

- **Sin conexión**: "No se pudo conectar con el servidor. Verifica tu conexión."
- **Email duplicado**: Mensaje del servidor (ej: "El correo ya está registrado")
- **Error del servidor**: "Error del servidor: 500"
- **Timeout**: "No se pudo conectar con el servidor. Verifica tu conexión."

## Debugging

### Ver logs en la consola:

```bash
# En la terminal donde corre Expo
npx expo start
```

Todos los errores se registran en la consola con `console.error`.

### Verificar la petición en el backend:

Asegúrate de que tu backend tenga logging para ver las peticiones entrantes.

### Usar herramientas de red:

- **React Native Debugger**
- **Reactotron**
- **Charles Proxy** / **Proxyman**

## Troubleshooting

### "Network request failed"

1. Verifica que el backend esté corriendo
2. Verifica la URL en `constants/api.ts`
3. En Android, usa `10.0.2.2` en lugar de `localhost`
4. En dispositivos físicos, asegúrate de estar en la misma WiFi

### "Cannot connect to server"

1. Verifica el firewall de tu computadora
2. Asegúrate de que el puerto 3000 esté abierto
3. Prueba acceder a `http://localhost:3000/api/users` desde tu navegador

### El formulario no valida correctamente

1. Revisa que react-hook-form esté instalado: `npm list react-hook-form`
2. Verifica que @react-native-picker/picker esté instalado

## Siguiente Paso

Después de un registro exitoso, el usuario es redirigido a la pantalla de login donde puede usar sus credenciales para iniciar sesión.
