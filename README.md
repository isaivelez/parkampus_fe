# 🚗 Parkampus - Sistema de Gestión de Parqueaderos

<div align="center">
  <img src="./assets/images/icon.png" alt="Parkampus Logo" width="120" height="120">
  
  [![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-~54.0.20-000020.svg)](https://expo.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-~5.9.2-blue.svg)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
</div>

## 📚 Información Académica

**Proyecto Universitario** - Ingeniería de Software 2  
**Institución:** Universidad Pascual Bravo - Sede Pilarica  
**Desarrollado por:** Isai David Vélez De León - Jhojan Steis Ropero Ruedas - Davison Lopez - Samuel Zapata Correa
**Período Académico:** 2025-2

---

## 📱 Descripción del Proyecto

**Parkampus** es una aplicación móvil innovadora diseñada para optimizar la gestión de parqueaderos en la Universidad Pascual Bravo, sede Pilarica. La aplicación permite a estudiantes, docentes y personal administrativo:

- 🔍 **Consultar disponibilidad** de espacios de parqueo en tiempo real
- 📅 **Reservar espacios** con anticipación
- 🗺️ **Localizar parqueaderos** dentro del campus
- 📊 **Gestionar** el uso eficiente de los espacios disponibles
- 🔔 **Recibir notificaciones** sobre el estado de las reservas

### 🎯 Objetivos

- Reducir el tiempo de búsqueda de parqueadero en el campus
- Optimizar el uso de los espacios disponibles
- Mejorar la experiencia de movilidad universitaria
- Implementar una solución tecnológica escalable y eficiente

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React Native con Expo
- **Lenguaje:** TypeScript
- **Navegación:** Expo Router
- **UI/UX:** Componentes nativos y personalizados
- **Desarrollo:** Expo CLI & VS Code

---

## 🚀 Configuración e Instalación

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Expo CLI
- Dispositivo móvil con Expo Go instalado

### 1️⃣ Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd parkampus_fe
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Iniciar el servidor de desarrollo

```bash
npm start
# o
npx expo start
```

### 4️⃣ Ejecutar en dispositivo móvil

Para probar en tu dispositivo físico:

```bash
npx expo start --tunnel
```

Luego escanea el código QR con la app **Expo Go** desde tu dispositivo móvil.

### 5️⃣ Ejecutar en emuladores

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Navegador web
npm run web
```

---

## 📱 Instrucciones para Dispositivos Físicos

### Para iPhone/iOS:

1. Descarga **Expo Go** desde el App Store
2. Asegúrate de estar en la misma red WiFi que tu computadora
3. Ejecuta `npx expo start --tunnel`
4. Escanea el código QR con Expo Go
5. ¡Listo! La app se cargará automáticamente

### Para Android:

1. Descarga **Expo Go** desde Google Play Store
2. Sigue los mismos pasos que para iOS

---

## 📁 Estructura del Proyecto

```
parkampus_fe/
├── app/                    # Pantallas principales (Expo Router)
│   ├── (tabs)/            # Navegación por pestañas
│   │   ├── index.tsx      # Pantalla principal
│   │   ├── explore.tsx    # Explorar parqueaderos
│   │   └── _layout.tsx    # Layout de pestañas
│   ├── _layout.tsx        # Layout principal
│   └── modal.tsx          # Pantallas modales
├── assets/                # Recursos estáticos
│   └── images/           # Iconos e imágenes
├── components/           # Componentes reutilizables
│   └── ui/              # Componentes de interfaz
├── constants/           # Constantes y temas
├── hooks/              # Hooks personalizados
└── scripts/            # Scripts de utilidad
```

---

## 🔧 Scripts Disponibles

| Script                  | Descripción                        |
| ----------------------- | ---------------------------------- |
| `npm start`             | Inicia el servidor de desarrollo   |
| `npm run android`       | Ejecuta en emulador Android        |
| `npm run ios`           | Ejecuta en simulador iOS           |
| `npm run web`           | Ejecuta en navegador web           |
| `npm run lint`          | Ejecuta el linter de código        |
| `npm run reset-project` | Reinicia el proyecto a estado base |

---

## 🎨 Características de la Aplicación

- ✨ **Diseño Responsivo** - Adaptable a diferentes tamaños de pantalla
- 🌙 **Modo Oscuro/Claro** - Tema automático según preferencias del sistema
- 🔄 **Hot Reload** - Recarga automática durante el desarrollo
- 📱 **Nativo** - Rendimiento optimizado para dispositivos móviles
- 🎯 **TypeScript** - Tipado estático para mayor robustez

---

## 🤝 Contribuciones

Este proyecto es parte de un trabajo académico. Para sugerencias o mejoras:

1. Crea un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👨‍💻 Desarrollador

**[Tu Nombre]**  
Estudiante de Ingeniería de Software  
Universidad Pascual Bravo - Sede Pilarica

📧 Email: [tu.email@pascualbravo.edu.co]  
📱 GitHub: [@tu-usuario-github]

---

<div align="center">
  <p>Desarrollado con ❤️ para la comunidad universitaria</p>
  <p><strong>Universidad Pascual Bravo - Ingeniería de Software 2</strong></p>
</div>
