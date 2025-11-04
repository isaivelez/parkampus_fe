import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu correo electrónico');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Por favor ingresa un correo electrónico válido');
      return;
    }

    if (!password.trim()) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        '¡Bienvenido! 🎉',
        `Hola, ${email.split('@')[0]}!\nAcceso concedido a Parkampus`,
        [
          {
            text: 'Continuar',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1">
      {/* Background con gradiente */}
      <LinearGradient
        colors={isDark ? ['#1a1a1a', '#2d3748', '#1a1a1a'] : ['#EBF4FF', '#DBEAFE', '#F0F9FF']}
        locations={[0, 0.5, 1]}
        className="absolute inset-0"
      />
      
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, minHeight: height }}
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            {/* Header decorativo con gradiente */}
            <LinearGradient
              colors={isDark ? ['#0D47A1', '#1976D2', '#42A5F5'] : ['#0D47A1', '#1565C0', '#42A5F5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="h-40 rounded-b-3xl"
            >
              <View className="flex-1 justify-center items-center pt-4">
                <Text className="text-white text-3xl font-bold tracking-wide mb-1">🚗 PARKAMPUS</Text>
                <Text className="text-white/90 text-base font-medium">Universidad Pascual Bravo</Text>
                <Text className="text-white/80 text-sm">Sede Pilarica</Text>
              </View>
            </LinearGradient>

            {/* Contenido principal */}
            <View className="flex-1 justify-center px-6 -mt-20">
              
              {/* Logo container con sombra mejorada */}
              <View className="items-center mb-8">
                <View className={`${isDark ? 'bg-gray-800/90' : 'bg-white/95'} rounded-3xl p-8 shadow-2xl border ${isDark ? 'border-gray-600/50' : 'border-white/20'}`}
                  style={{
                    shadowColor: isDark ? '#000' : '#0D47A1',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: isDark ? 0.3 : 0.15,
                    shadowRadius: 20,
                    elevation: 10,
                  }}
                >
                  <LinearGradient
                    colors={['#42A5F5', '#0D47A1']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="rounded-full p-6 mb-4"
                  >
                    <IconSymbol 
                      name="car.fill" 
                      size={72} 
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                  <Text className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-parkampus-main'} text-center mb-2`}>
                    ¡Bienvenido!
                  </Text>
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-center text-base leading-5`}>
                    Sistema de Gestión de{'\n'}
                    Parqueaderos Universitarios
                  </Text>
                </View>
              </View>

              {/* Formulario con diseño premium */}
              <View className={`${isDark ? 'bg-gray-800/90' : 'bg-white/95'} rounded-3xl p-8 shadow-2xl border ${isDark ? 'border-gray-600/50' : 'border-white/20'} mb-6`}
                style={{
                  shadowColor: isDark ? '#000' : '#0D47A1',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: isDark ? 0.3 : 0.15,
                  shadowRadius: 20,
                  elevation: 10,
                }}
              >
                
                {/* Campo de email */}
                <View className="mb-6">
                  <Text className={`${isDark ? 'text-white' : 'text-parkampus-black'} font-bold mb-3 text-lg flex-row items-center`}>
                    📧 Correo Electrónico
                  </Text>
                  <View className={`border-2 rounded-2xl transition-all duration-200 ${
                    emailFocused 
                      ? 'border-parkampus-main bg-blue-50/80 scale-105' 
                      : isDark 
                        ? 'border-gray-600 bg-gray-700/50' 
                        : 'border-gray-200 bg-gray-50/50'
                  }`}
                    style={{
                      shadowColor: emailFocused ? ParkampusTheme.colors.main : 'transparent',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: emailFocused ? 0.3 : 0,
                      shadowRadius: 8,
                      elevation: emailFocused ? 5 : 0,
                    }}
                  >
                    <TextInput
                      className={`px-5 py-4 text-lg ${isDark ? 'text-white' : 'text-parkampus-black'} font-medium`}
                      placeholder="tu-correo@pascualbravo.edu.co"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                    />
                  </View>
                </View>

                {/* Campo de contraseña */}
                <View className="mb-8">
                  <Text className={`${isDark ? 'text-white' : 'text-parkampus-black'} font-bold mb-3 text-lg`}>
                    🔒 Contraseña
                  </Text>
                  <View className={`border-2 rounded-2xl transition-all duration-200 ${
                    passwordFocused 
                      ? 'border-parkampus-main bg-blue-50/80 scale-105' 
                      : isDark 
                        ? 'border-gray-600 bg-gray-700/50' 
                        : 'border-gray-200 bg-gray-50/50'
                  }`}
                    style={{
                      shadowColor: passwordFocused ? ParkampusTheme.colors.main : 'transparent',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: passwordFocused ? 0.3 : 0,
                      shadowRadius: 8,
                      elevation: passwordFocused ? 5 : 0,
                    }}
                  >
                    <TextInput
                      className={`px-5 py-4 text-lg ${isDark ? 'text-white' : 'text-parkampus-black'} font-medium`}
                      placeholder="Mínimo 6 caracteres"
                      placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                    />
                  </View>
                </View>

                {/* Botón de login con gradiente mejorado */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  className={`rounded-2xl overflow-hidden ${isLoading ? 'opacity-50' : ''}`}
                  style={{
                    shadowColor: ParkampusTheme.colors.main,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: isLoading ? 0 : 0.4,
                    shadowRadius: 12,
                    elevation: isLoading ? 0 : 8,
                  }}
                >
                  <LinearGradient
                    colors={isLoading ? ['#6B7280', '#4B5563'] : ['#0D47A1', '#1565C0', '#42A5F5']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="py-5 items-center justify-center"
                  >
                    <View className="flex-row items-center">
                      {isLoading && (
                        <View className="mr-3">
                          <Text className="text-white text-xl">⏳</Text>
                        </View>
                      )}
                      <Text className="text-white font-bold text-xl tracking-wide">
                        {isLoading ? 'Verificando credenciales...' : '🚀 Iniciar Sesión'}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Enlaces adicionales con mejor diseño */}
              <View className="items-center space-y-4 mb-6">
                <TouchableOpacity className="py-3 px-6 rounded-xl">
                  <Text className={`${isDark ? 'text-parkampus-light' : 'text-parkampus-main'} font-bold text-lg`}>
                    🔑 ¿Olvidaste tu contraseña?
                  </Text>
                </TouchableOpacity>
                
                <View className={`w-24 h-1 ${isDark ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`} />
                
                <TouchableOpacity className="py-3 px-6 rounded-xl">
                  <Text className={`${isDark ? 'text-parkampus-light' : 'text-parkampus-main'} font-bold text-lg`}>
                    ✨ ¿No tienes cuenta? Regístrate
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Footer mejorado */}
              <View className="items-center mt-4 pb-8">
                <View className={`${isDark ? 'bg-gray-800/70' : 'bg-white/70'} rounded-2xl px-8 py-6 border ${isDark ? 'border-gray-600/30' : 'border-gray-200/30'}`}>
                  <Text className={`${isDark ? 'text-gray-300' : 'text-gray-500'} text-base text-center leading-6 font-medium`}>
                    🎓 Ingeniería de Software 2{'\n'}
                    © 2025 Universidad Pascual Bravo
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}