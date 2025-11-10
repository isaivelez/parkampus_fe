# 📝 Resumen: Configuración del Registro con API

## ✅ Lo que se implementó

### 1. **Servicio de Usuarios** (`services/userService.ts`)

- ✅ Función `registerUser()` para registrar usuarios
- ✅ Manejo de errores tipado con `ApiError`
- ✅ Tipos TypeScript para request y response
- ✅ Timeout configurable (10 segundos)
- ✅ Headers correctos para JSON

### 2. **Configuración de API** (`constants/api.ts`)

- ✅ URL base configurable: `http://localhost:3000`
- ✅ Endpoints centralizados
- ✅ Timeout global configurable
- ✅ Fácil de cambiar para producción

### 3. **Formulario de Registro** (`app/register.tsx`)

- ✅ Integración con el servicio de usuarios
- ✅ Transformación de datos del formulario al formato del API
- ✅ Manejo de errores del servidor
- ✅ Mensajes de error descriptivos
- ✅ Redirección a login después del registro exitoso

### 4. **Documentación**

- ✅ `docs/API_SETUP.md` - Configuración del API por entorno
- ✅ `docs/TESTING_REGISTER.md` - Guía completa de testing

## 📦 Dependencias Instaladas

```json
{
  "axios": "^1.7.7",
  "react-hook-form": "^7.66.0",
  "@react-native-picker/picker": "^2.x.x"
}
```

## 🔄 Flujo de Datos

```
Usuario llena formulario
    ↓
react-hook-form valida campos
    ↓
onSubmit() transforma datos
    ↓
registerUser() hace POST request
    ↓
Backend responde
    ↓
Success → Redirect a /login
Error → Alert con mensaje
```

## 📤 Formato del Request

**Endpoint:** `POST http://localhost:3000/api/users`

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
  "first_name": "Juan",
  "last_name": "Pérez García",
  "email": "juan.perez@pascualbravo.edu.co",
  "password": "Test1234!",
  "user_type": "estudiante"
}
```

## 📥 Formato de la Response

**Success (200/201):**

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

**Error (4xx/5xx):**

```json
{
  "success": false,
  "message": "El correo ya está registrado",
  "error": "DUPLICATE_EMAIL"
}
```

## 🎯 Mapeo de Campos

| Formulario | API Key    | Tipo                                    |
| ---------- | ---------- | --------------------------------------- |
| nombre     | first_name | string                                  |
| apellido   | last_name  | string                                  |
| correo     | email      | string (@pascualbravo.edu.co)           |
| password   | password   | string (min 8 chars, validaciones)      |
| rol        | user_type  | 'celador' \| 'estudiante' \| 'empleado' |

## 🔐 Validaciones del Formulario

✅ **Nombre y Apellido:** Requeridos, mínimo 2 caracteres
✅ **Correo:** Requerido, formato email, dominio @pascualbravo.edu.co
✅ **Rol:** Requerido, uno de: celador, estudiante, empleado
✅ **Contraseña:**

- Mínimo 8 caracteres
- Una mayúscula
- Una minúscula
- Un número
- Un carácter especial
  ✅ **Confirmar Contraseña:** Debe coincidir

## 🛠️ Para Diferentes Entornos

### iOS Simulator

```typescript
export const API_BASE_URL = "http://localhost:3000";
```

### Android Emulator

```typescript
export const API_BASE_URL = "http://10.0.2.2:3000";
```

### Dispositivo Físico

```typescript
export const API_BASE_URL = "http://192.168.1.XXX:3000";
```

### Producción

```typescript
export const API_BASE_URL = "https://api.tuparkampus.com";
```

## 🧪 Cómo Probar

1. **Iniciar el backend:**

   ```bash
   cd tu-backend
   npm start
   ```

2. **Verificar el endpoint:**

   ```bash
   curl http://localhost:3000/api/users
   ```

3. **Configurar la URL en `constants/api.ts`**

4. **Llenar el formulario con datos válidos**

5. **Presionar "Registrar"**

6. **Verificar:**
   - ✅ Loading state en el botón
   - ✅ Alert de éxito/error
   - ✅ Redirección a login si es exitoso
   - ✅ Logs en la consola

## 📂 Archivos Creados/Modificados

```
parkampus_fe/
├── app/
│   └── register.tsx              ← Actualizado con integración API
├── constants/
│   └── api.ts                    ← Nuevo: Configuración de API
├── services/
│   └── userService.ts            ← Nuevo: Servicio de usuarios
└── docs/
    ├── API_SETUP.md              ← Nuevo: Guía de configuración
    └── TESTING_REGISTER.md       ← Nuevo: Guía de testing
```

## 🚀 Próximos Pasos

1. **Implementar el login con API**
2. **Agregar autenticación con tokens**
3. **Guardar token en AsyncStorage**
4. **Proteger rutas privadas**
5. **Agregar refresh token**

## 💡 Tips

- **Usa la IP local** para testing en dispositivos físicos
- **Verifica el firewall** si no puedes conectarte
- **Revisa los logs** en la consola de Expo
- **Usa React Native Debugger** para ver peticiones de red
- **Agrega interceptors** de axios para manejo global de errores

## 📞 Support

Si tienes problemas:

1. Revisa `docs/API_SETUP.md`
2. Revisa `docs/TESTING_REGISTER.md`
3. Verifica que el backend esté corriendo
4. Verifica la URL en `constants/api.ts`
5. Revisa los logs de la consola
