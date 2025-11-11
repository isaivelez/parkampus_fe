# Vista de Celador - Panel de Control

## 🎯 Funcionalidad

Se ha implementado una vista especial para usuarios con `user_type: "celador"` que muestra la disponibilidad total de espacios de parqueo en tiempo real.

## 📊 Características

### 1. **Cards de Disponibilidad**

Dos cards principales que muestran:

- **Para Carro 🚗**: Total de espacios disponibles para carros
- **Para Moto 🏍️**: Total de espacios disponibles para motos

### 2. **Sistema de Colores Inteligente**

Los contadores cambian de color según la disponibilidad:

| Disponibilidad | Color      | Código    |
| -------------- | ---------- | --------- |
| < 10 espacios  | 🔴 Rojo    | `#EF4444` |
| 10-20 espacios | 🟠 Naranja | `#F59E0B` |
| > 20 espacios  | 🟢 Verde   | `#22C55E` |

### 3. **Leyenda de Indicadores**

Una leyenda visual que muestra el significado de cada color para facilitar la interpretación.

### 4. **Detalle por Estacionamiento**

Lista completa de todos los estacionamientos con:

- Nombre del estacionamiento
- Disponibilidad de carros con código de color
- Disponibilidad de motos con código de color

### 5. **Pull to Refresh**

El celador puede deslizar hacia abajo para refrescar los datos en tiempo real.

## 🔌 Integración con API

### Endpoint consumido:

```
GET http://192.168.40.67:3000/api/parking-lots
```

### Estructura de respuesta:

```json
{
  "success": true,
  "message": "Parking lots obtenidos exitosamente",
  "count": 5,
  "data": [
    {
      "_id": "6912cc038fed75578817df22",
      "name": "Estacionamiento Bloque 27",
      "moto_available": 20,
      "car_available": 50,
      "created_at": "2025-11-11T05:39:15.246Z",
      "updated_at": "2025-11-11T05:48:24.762Z"
    }
    // ... más estacionamientos
  ]
}
```

## 📁 Archivos creados/modificados

1. **`services/parkingService.ts`** (nuevo)

   - Servicio para consumir el API de parking lots
   - Función `getParkingLots()` con manejo de errores
   - Tipos TypeScript: `ParkingLot`, `ParkingLotsResponse`

2. **`constants/api.ts`** (modificado)

   - Agregado endpoint `PARKING_LOTS`

3. **`app/(tabs)/index.tsx`** (modificado)
   - Lógica para detectar tipo de usuario
   - Vista de celador con cards de disponibilidad
   - Cálculo de totales automático
   - Sistema de colores dinámico
   - Pull to refresh
   - Vista por defecto para estudiantes/empleados

## 🎨 Diseño

### Vista de Celador

```
┌─────────────────────────────┐
│  Panel de Control           │
│  ┌──────────┐  ┌──────────┐│
│  │   🚗     │  │   🏍️    ││
│  │ Para     │  │ Para     ││
│  │ Carro    │  │ Moto     ││
│  │   50     │  │   120    ││ <- Números grandes con color
│  └──────────┘  └──────────┘│
│                             │
│  Indicadores:               │
│  🔴 < 10  🟠 10-20  🟢 >20 │
│                             │
│  Detalle por estacionamiento│
│  ┌─────────────────────────┐│
│  │ Estacionamiento Bloque 27│
│  │  🚗 50    🏍️ 20        ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Vista de Estudiante/Empleado

Sigue mostrando la lista de celdas individuales como antes.

## 💡 Cómo funciona

1. **Al hacer login como celador:**

   - El sistema detecta `user_type === 'celador'`
   - Se carga automáticamente la vista de celador
   - Se hace una petición GET a `/api/parking-lots`

2. **Cálculo de totales:**

   ```typescript
   const totalCarAvailable = parkingLots.reduce(
     (sum, lot) => sum + lot.car_available,
     0
   );
   const totalMotoAvailable = parkingLots.reduce(
     (sum, lot) => sum + lot.moto_available,
     0
   );
   ```

3. **Color dinámico:**

   ```typescript
   const getAvailabilityColor = (count: number): string => {
     if (count < 10) return "#EF4444"; // Rojo
     if (count <= 20) return "#F59E0B"; // Naranja
     return "#22C55E"; // Verde
   };
   ```

4. **Actualización:**
   - El celador puede deslizar hacia abajo para refrescar
   - Los datos se recargan desde el API
   - Los contadores se actualizan automáticamente

## 🧪 Testing

Para probar la funcionalidad:

1. **Login como celador:**

   ```
   Email: [correo de celador]
   Password: [contraseña]
   ```

2. **Verificar que aparezcan:**

   - Las 2 cards grandes con los contadores
   - Los colores según la disponibilidad
   - La leyenda de indicadores
   - La lista detallada de estacionamientos

3. **Probar refresh:**
   - Deslizar hacia abajo para recargar datos
   - Verificar que los números se actualicen

## 🎯 Beneficios

✅ **Visibilidad inmediata** de la disponibilidad total
✅ **Identificación rápida** de problemas con el código de colores
✅ **Detalle completo** por estacionamiento
✅ **Actualización en tiempo real** con pull to refresh
✅ **Interfaz intuitiva** diseñada específicamente para celadores

## 🔄 Estados

- **Cargando**: Muestra un ActivityIndicator mientras se cargan los datos
- **Con datos**: Muestra las cards y la lista de estacionamientos
- **Error**: Alert con mensaje de error si falla la petición
- **Refrescando**: Indicador de refresh al deslizar hacia abajo
