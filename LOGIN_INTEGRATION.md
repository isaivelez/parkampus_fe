# Integración de Login con Backend

## ✅ Cambios implementados

### 1. **Servicio de Login** (`services/userService.ts`)

Se agregó la función `loginUser()` que consume el endpoint de login:

```typescript
export const loginUser = async (data: LoginUserData): Promise<LoginUserResponse>
```

**Endpoint:** `http://192.168.40.67:3000/api/login`

**Body de la petición:**

```json
{
  "email": "juan.perez@estudiante.edu.co",
  "password": "miPassword123"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "user": {
      "_id": "6912457d4e01044294493355",
      "first_name": "Juan",
      "last_name": "Pérez García",
      "email": "juan.perez@estudiante.edu.co",
      "user_type": "estudiante",
      "created_at": "2025-11-10T20:05:17.077Z",
      "updated_at": "2025-11-10T20:05:17.077Z"
    }
  }
}
```

### 2. **Contexto de Autenticación** (`contexts/AuthContext.tsx`)

Se creó un contexto global para manejar el estado del usuario autenticado:

- **Estado del usuario:** Almacena la información del usuario logueado
- **Persistencia:** Guarda el usuario en AsyncStorage
- **Función logout:** Limpia el estado y AsyncStorage
- **Hook personalizado:** `useAuth()` para acceder al contexto

### 3. **Pantalla de Login actualizada** (`app/login.tsx`)

- ✅ **Integración con API:** Ya no usa credenciales hardcodeadas
- ✅ **Validación de correo:** Campo de email con validación de formato
- ✅ **Manejo de errores:** Muestra mensajes de error del backend
- ✅ **Redirección automática:** Al hacer login exitoso, redirige a `/(tabs)`
- ✅ **Guardado de usuario:** Almacena la información del usuario en el contexto

### 4. **Dashboard con información de usuario** (`app/(tabs)/index.tsx`)

- ✅ **Mensaje de bienvenida personalizado:** Muestra el nombre del usuario
- ✅ **Indicador de rol:** Muestra el tipo de usuario (estudiante, empleado, celador)
- ✅ **Botón de logout:** Icono en la esquina superior derecha
- ✅ **Confirmación de cierre:** Alert antes de cerrar sesión
- ✅ **Limpieza de estado:** Al hacer logout, limpia el contexto y redirige al login

### 5. **Icono de logout agregado** (`components/ui/icon-symbol.tsx`)

- Mapeo de `rectangle.portrait.and.arrow.right` (SF Symbol) a `logout` (Material Icon)

## 📦 Dependencias instaladas

```bash
npm install @react-native-async-storage/async-storage
```

## 🚀 Flujo de autenticación

1. **Usuario ingresa credenciales** en el formulario de login
2. **Se envía petición POST** a `/api/login` con email y password
3. **Backend valida credenciales** y devuelve información del usuario
4. **Se guarda usuario** en el contexto y AsyncStorage
5. **Redirección automática** al dashboard `/(tabs)`
6. **Dashboard muestra información** personalizada del usuario
7. **Botón de logout** permite cerrar sesión y volver al login

## 🔐 Seguridad

- Las credenciales se envían mediante HTTPS (en producción)
- El password no se almacena localmente, solo la información del usuario
- AsyncStorage para persistencia de sesión
- Validación de formato de email en el frontend

## 🧪 Testing

Para probar el login, necesitas un usuario registrado en el backend. Puedes:

1. **Registrar un nuevo usuario** desde la pantalla de registro
2. **Usar un usuario existente** del backend

Ejemplo de credenciales de prueba:

```
Email: juan.perez@estudiante.edu.co
Password: miPassword123
```

## 📝 Notas

- El token de sesión puede agregarse en futuras versiones para mayor seguridad
- AsyncStorage persiste la sesión entre reinicios de la app
- El logout limpia completamente el estado de autenticación
