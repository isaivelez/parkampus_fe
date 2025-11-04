import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Tipos para el formulario
type LoginFormData = {
  email: string;
  password: string;
};

// Credenciales hardcodeadas
const ADMIN_CREDENTIALS = {
  email: 'admin',
  password: '1234'
};

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Verificar credenciales hardcodeadas
      if (data.email === ADMIN_CREDENTIALS.email && data.password === ADMIN_CREDENTIALS.password) {
        // Simular delay de red
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        Alert.alert(
          '¡Bienvenido! 🎉',
          'Acceso concedido a Parkampus',
          [
            {
              text: 'Continuar',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Credenciales incorrectas. Usa: admin / 1234');
      }
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al iniciar sesión. Intenta de nuevo.');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#FFFFFF',
    },
    safeArea: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 40,
    },
    // Logo y título
    logoContainer: {
      alignItems: 'center',
      marginBottom: 60,
    },
    logoIcon: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? '#A0A0A0' : '#666666',
      textAlign: 'center',
    },
    // Formulario
    formContainer: {
      marginBottom: 40,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '500',
      color: isDark ? '#FFFFFF' : '#000000',
      marginBottom: 8,
    },
    textInput: {
      height: 50,
      borderWidth: 1,
      borderColor: isDark ? '#333333' : '#E0E0E0',
      borderRadius: 8,
      paddingHorizontal: 16,
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#000000',
      backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA',
    },
    textInputError: {
      borderColor: '#EF4444',
    },
    errorText: {
      color: '#EF4444',
      fontSize: 14,
      marginTop: 4,
    },
    textInputFocused: {
      borderColor: ParkampusTheme.colors.main,
      backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
    },
    // Botón de login
    loginButton: {
      height: 50,
      backgroundColor: ParkampusTheme.colors.main,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    // Enlaces
    linksContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    linkButton: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    linkText: {
      color: ParkampusTheme.colors.main,
      fontSize: 16,
      fontWeight: '500',
    },
    // Footer
    footerContainer: {
      marginTop: 40,
      alignItems: 'center',
    },
    footerText: {
      fontSize: 14,
      color: isDark ? '#666666' : '#999999',
      textAlign: 'center',
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo y título */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <IconSymbol 
                  name="car.fill" 
                  size={60} 
                  color={ParkampusTheme.colors.main}
                />
              </View>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Bienvenido de vuelta a Parkampus
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              {/* Campo de email */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Usuario</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{ 
                    required: 'El usuario es requerido',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.textInput, errors.email && styles.textInputError]}
                      placeholder="admin"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="username"
                      textContentType="username"
                    />
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email.message}</Text>
                )}
              </View>

              {/* Campo de contraseña */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{ 
                    required: 'La contraseña es requerida',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.textInput, errors.password && styles.textInputError]}
                      placeholder="1234"
                      placeholderTextColor={isDark ? '#666666' : '#999999'}
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry
                      autoComplete="password"
                      textContentType="password"
                    />
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
              </View>

              {/* Botón de login */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={[
                  styles.loginButton,
                  isSubmitting && styles.loginButtonDisabled
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>
                  {isSubmitting ? 'Iniciando sesión...' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Enlaces */}
            <View style={styles.linksContainer}>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>Crear una cuenta</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>
                Ingeniería de Software 2{'\n'}
                © 2025 Universidad Pascual Bravo
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}