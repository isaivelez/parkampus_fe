# Edición Inline de Disponibilidad - Vista de Celador

## 🎯 Nueva Funcionalidad

Se ha implementado la capacidad para que los celadores puedan **actualizar los valores de disponibilidad** de cada estacionamiento directamente desde la lista, sin cambiar de vista.

## ✨ Características

### 1. **Botón de Actualizar**

Cada card de estacionamiento muestra un botón "✏️ Actualizar" en la esquina superior derecha.

### 2. **Edición Inline**

Al presionar "Actualizar", la card se transforma mostrando:

- Dos campos de entrada numérica (🚗 Carros y 🏍️ Motos)
- Los valores actuales como valores iniciales del formulario
- Botones de acción (Cancelar y Guardar)

### 3. **Validaciones**

- ✅ **No negativos**: Los valores deben ser ≥ 0
- ✅ **Sólo números**: Valida que sean números enteros
- ✅ **Campos requeridos**: No permite valores vacíos
- ✅ **Valor cero permitido**: 0 es un valor válido

### 4. **Botones de Acción**

- **Cancelar (gris)**: Restaura los valores originales y vuelve al modo lectura
- **💾 Guardar (azul)**: Envía los cambios al backend

## 🔌 Integración con API

### Endpoint utilizado:

```
PUT http://192.168.40.67:3000/api/parking-lots/:parkingId
```

### Body de la petición:

```json
{
  "moto_available": 20,
  "car_available": 50
}
```

### Respuesta esperada:

```json
{
  "success": true,
  "message": "Parking lot actualizado exitosamente",
  "data": {
    "_id": "6912cc038fed75578817df22",
    "name": "Estacionamiento Bloque 27",
    "moto_available": 20,
    "car_available": 50,
    "created_at": "2025-11-11T05:39:15.246Z",
    "updated_at": "2025-11-11T06:15:30.123Z"
  }
}
```

## 📁 Archivos modificados

### 1. **`services/parkingService.ts`**

Agregado:

- Tipo `UpdateParkingLotData`
- Tipo `UpdateParkingLotResponse`
- Función `updateParkingLot(parkingId, data)`

### 2. **`app/(tabs)/index.tsx`**

Agregado:

- Estado `editingLotId` para trackear qué card está en modo edición
- Componente `ParkingLotCard` con formulario inline
- React Hook Form para manejo del formulario
- Validaciones de campos
- Estilos para el formulario y botones

## 🎨 Diseño

### Modo Lectura (Normal)

```
┌─────────────────────────────────┐
│ Estacionamiento Bloque 27       │
│                    ✏️ Actualizar│
│                                 │
│     🚗           🏍️             │
│     50           20             │
└─────────────────────────────────┘
```

### Modo Edición

```
┌─────────────────────────────────┐
│ Estacionamiento Bloque 27       │
│                                 │
│  🚗 Carros      🏍️ Motos        │
│  ┌─────────┐   ┌─────────┐     │
│  │   50    │   │   20    │     │
│  └─────────┘   └─────────┘     │
│                                 │
│         Cancelar   💾 Guardar   │
└─────────────────────────────────┘
```

## 💡 Flujo de Uso

1. **Celador ve la lista** de estacionamientos
2. **Click en "✏️ Actualizar"** en el estacionamiento deseado
3. **La card se transforma** mostrando los campos editables
4. **Celador modifica los valores** según necesidad
5. **Dos opciones:**
   - **Cancelar**: Descarta cambios y vuelve a modo lectura
   - **Guardar**: Valida, envía al backend y actualiza

## ✅ Validaciones Implementadas

### Campo "car_available"

```typescript
rules={{
  required: 'Campo requerido',
  validate: {
    isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
    isNotNegative: (value) => parseInt(value) >= 0 || 'No puede ser negativo',
  },
}}
```

### Campo "moto_available"

```typescript
rules={{
  required: 'Campo requerido',
  validate: {
    isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
    isNotNegative: (value) => parseInt(value) >= 0 || 'No puede ser negativo',
  },
}}
```

## 🔄 Estados del Componente

### Estado: `editingLotId`

- `null`: Ninguna card en modo edición (todas en lectura)
- `string`: ID del parking lot en modo edición

### Lógica de edición

```typescript
const isEditing = editingLotId === lot._id;
```

Solo UNA card puede estar en modo edición a la vez.

## 🎯 Comportamiento

### Al hacer clic en "Actualizar":

1. Se establece `editingLotId = lot._id`
2. El formulario se inicializa con los valores actuales
3. La card muestra los inputs en lugar de los números

### Al hacer clic en "Cancelar":

1. Se resetea el formulario a valores originales
2. Se establece `editingLotId = null`
3. La card vuelve a modo lectura

### Al hacer clic en "Guardar":

1. Se validan los campos
2. Si hay errores, se muestran mensajes debajo de los inputs
3. Si es válido:
   - Se convierte strings a integers
   - Se hace PUT al endpoint
   - Se refresca la lista completa
   - Se establece `editingLotId = null`
   - Se muestra Alert de éxito

### En caso de error del API:

- Se muestra Alert con el mensaje de error
- La card permanece en modo edición
- El usuario puede corregir o cancelar

## 🧪 Testing

### Caso 1: Edición exitosa

1. Login como celador
2. Click en "✏️ Actualizar" en cualquier estacionamiento
3. Cambiar valor de carros a 30
4. Cambiar valor de motos a 15
5. Click en "💾 Guardar"
6. ✅ Debe mostrar alert de éxito
7. ✅ Los valores deben actualizarse
8. ✅ Los contadores superiores deben recalcularse

### Caso 2: Validación de negativos

1. En modo edición, ingresar -5 en carros
2. Click en "💾 Guardar"
3. ❌ Debe mostrar error "No puede ser negativo"

### Caso 3: Validación de texto

1. En modo edición, ingresar "abc" en motos
2. Click en "💾 Guardar"
3. ❌ Debe mostrar error "Debe ser un número"

### Caso 4: Cancelar edición

1. En modo edición, cambiar valores
2. Click en "Cancelar"
3. ✅ Debe volver a mostrar valores originales
4. ✅ Card debe volver a modo lectura

### Caso 5: Valor cero

1. En modo edición, ingresar 0 en ambos campos
2. Click en "💾 Guardar"
3. ✅ Debe aceptar y guardar

## 🎨 Estilos del Formulario

### Botón Actualizar

- Fondo: Gris (`ParkampusTheme.colors.gray`)
- Texto: Blanco con emoji ✏️

### Inputs

- Borde gris claro en estado normal
- Fondo gris muy claro
- Borde rojo y fondo rosa claro cuando hay error

### Botón Cancelar

- Fondo: Gris claro (`#E5E7EB`)
- Texto: Gris oscuro

### Botón Guardar

- Fondo: Azul principal (`ParkampusTheme.colors.main`)
- Texto: Blanco con emoji 💾
- Opacidad reducida cuando está enviando

## 🚀 Ventajas

✅ **Edición rápida**: No requiere navegar a otra pantalla
✅ **Validación inmediata**: Feedback instantáneo de errores
✅ **Cancelación segura**: Puede descartar cambios fácilmente
✅ **Actualización automática**: Los totales se recalculan al guardar
✅ **Una a la vez**: Solo una card en edición para evitar confusión
✅ **Estado persistente**: Los valores originales se mantienen si cancela
