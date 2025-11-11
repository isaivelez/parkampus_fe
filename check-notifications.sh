#!/bin/bash

# Script para verificar la configuración de notificaciones push en Parkampus FE

echo "🔍 Verificando configuración de Parkampus FE..."
echo ""

# 1. Verificar que las dependencias estén instaladas
echo "📦 1. Verificando dependencias de notificaciones..."
if grep -q "expo-notifications" package.json; then
    echo "   ✅ expo-notifications instalado"
else
    echo "   ❌ expo-notifications NO instalado"
    echo "   👉 Ejecuta: npx expo install expo-notifications expo-device expo-constants"
    exit 1
fi

if grep -q "expo-device" package.json; then
    echo "   ✅ expo-device instalado"
else
    echo "   ❌ expo-device NO instalado"
    exit 1
fi

if grep -q "expo-constants" package.json; then
    echo "   ✅ expo-constants instalado"
else
    echo "   ❌ expo-constants NO instalado"
    exit 1
fi

echo ""

# 2. Verificar que existan los archivos clave
echo "📁 2. Verificando archivos de configuración..."

if [ -f "services/NotificationService.ts" ]; then
    echo "   ✅ NotificationService.ts existe"
else
    echo "   ❌ NotificationService.ts NO existe"
    exit 1
fi

if [ -f "contexts/NotificationContext.tsx" ]; then
    echo "   ✅ NotificationContext.tsx existe"
else
    echo "   ❌ NotificationContext.tsx NO existe"
    exit 1
fi

if [ -f "NOTIFICATIONS_SETUP.md" ]; then
    echo "   ✅ NOTIFICATIONS_SETUP.md existe"
else
    echo "   ⚠️  NOTIFICATIONS_SETUP.md NO existe (no es crítico)"
fi

echo ""

# 3. Verificar app.json
echo "⚙️  3. Verificando app.json..."

if grep -q "expo-notifications" app.json; then
    echo "   ✅ Plugin expo-notifications configurado"
else
    echo "   ❌ Plugin expo-notifications NO configurado en app.json"
    exit 1
fi

if grep -q "UIBackgroundModes" app.json; then
    echo "   ✅ UIBackgroundModes configurado para iOS"
else
    echo "   ⚠️  UIBackgroundModes NO configurado (necesario para background notifications)"
fi

echo ""

# 4. Verificar que el backend esté accesible
echo "🌐 4. Verificando conexión con el backend..."

# Leer la URL del backend desde NotificationService.ts
BACKEND_URL=$(grep -o "http://[0-9.]*:[0-9]*/api" services/NotificationService.ts | head -1 | sed 's|/api||')

if [ -z "$BACKEND_URL" ]; then
    echo "   ⚠️  No se pudo detectar la URL del backend en NotificationService.ts"
else
    echo "   📍 Backend configurado en: $BACKEND_URL"
    
    # Intentar hacer ping al health endpoint
    if command -v curl &> /dev/null; then
        if curl -s -f "${BACKEND_URL}/health" > /dev/null 2>&1; then
            echo "   ✅ Backend está respondiendo"
        else
            echo "   ⚠️  Backend no está respondiendo (asegúrate de que esté corriendo)"
            echo "   👉 Ejecuta en parkampus_be: npm run dev"
        fi
    else
        echo "   ⚠️  curl no disponible, no se puede verificar backend"
    fi
fi

echo ""

# 5. Verificar que Node modules estén instalados
echo "📦 5. Verificando node_modules..."

if [ -d "node_modules" ]; then
    echo "   ✅ node_modules existe"
else
    echo "   ❌ node_modules NO existe"
    echo "   👉 Ejecuta: npm install"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Configuración de notificaciones verificada!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Próximos pasos:"
echo ""
echo "1. Asegúrate de que el backend esté corriendo:"
echo "   cd ../parkampus_be && npm run dev"
echo ""
echo "2. Inicia la aplicación:"
echo "   npm run ios    # Para simulador iOS"
echo "   npm start      # Para Expo Go en dispositivo físico"
echo ""
echo "3. Inicia sesión y acepta los permisos de notificaciones"
echo ""
echo "4. Prueba enviando una notificación desde el backend:"
echo "   curl -X POST ${BACKEND_URL:-http://localhost:3000}/api/notifications/send-to-all \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{\"title\": \"🅿️ Prueba\", \"message\": \"Notificación de prueba\"}'"
echo ""
echo "📖 Documentación completa: ./NOTIFICATIONS_SETUP.md"
echo ""
