import { IconSymbol } from "@/components/ui/icon-symbol";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipos para el formulario
type LoginFormData = {
  email: string;
  password: string;
};

// Credenciales hardcodeadas
const ADMIN_CREDENTIALS = {
  email: "admin",
  password: "1234",
};

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // Verificar credenciales hardcodeadas
      if (
        data.email === ADMIN_CREDENTIALS.email &&
        data.password === ADMIN_CREDENTIALS.password
      ) {
        // Simular delay de red
        await new Promise((resolve) => setTimeout(resolve, 1000));

        Alert.alert("¡Bienvenido! 🎉", "Acceso concedido a Parkampus", [
          {
            text: "Continuar",
            onPress: () => router.replace("/(tabs)"),
          },
        ]);
      } else {
        Alert.alert("Error", "Credenciales incorrectas. Usa: admin / 1234");
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "Hubo un problema al iniciar sesión. Intenta de nuevo."
      );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#000000" : "#F5F7FA",
    },
    safeArea: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
      paddingVertical: 32,
    },
    // Header
    headerContainer: {
      alignItems: "center",
      marginBottom: 40,
    },
    iconContainer: {
      width: 100,
      height: 100,
      borderRadius: 20,
      backgroundColor: ParkampusTheme.colors.main,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "600",
      color: isDark ? "#FFFFFF" : "#1F2937",
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: isDark ? "#9CA3AF" : "#6B7280",
      textAlign: "center",
    },
    // Formulario
    formContainer: {
      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: isDark ? "#F3F4F6" : "#374151",
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: isDark ? "#374151" : "#D1D5DB",
      borderRadius: 8,
      backgroundColor: isDark ? "#111827" : "#F9FAFB",
      paddingHorizontal: 12,
    },
    inputWrapperError: {
      borderColor: "#DC2626",
      backgroundColor: isDark ? "#1F1416" : "#FEF2F2",
    },
    inputIcon: {
      marginRight: 8,
    },
    textInput: {
      flex: 1,
      height: 48,
      fontSize: 15,
      color: isDark ? "#FFFFFF" : "#111827",
    },
    eyeButton: {
      padding: 4,
    },
    errorText: {
      fontSize: 13,
      color: "#DC2626",
      marginTop: 4,
    },
    // Botón
    submitButton: {
      height: 50,
      backgroundColor: ParkampusTheme.colors.main,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 8,
      shadowColor: ParkampusTheme.colors.main,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    submitButtonDisabled: {
      opacity: 0.6,
      shadowOpacity: 0,
      elevation: 0,
    },
    submitButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    // Footer
    footerContainer: {
      alignItems: "center",
      marginTop: 24,
    },
    footerText: {
      fontSize: 15,
      color: isDark ? "#9CA3AF" : "#6B7280",
    },
    linkButton: {
      marginTop: 8,
    },
    linkText: {
      fontSize: 15,
      color: ParkampusTheme.colors.main,
      fontWeight: "600",
    },
    divider: {
      marginVertical: 16,
    },
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.headerContainer}>
              <View style={styles.iconContainer}>
                <IconSymbol name="car.fill" size={50} color="#FFFFFF" />
              </View>
              <Text style={styles.title}>Login</Text>
              <Text style={styles.subtitle}>
                Bienvenido de vuelta a Parkampus
              </Text>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              {/* Campo de usuario */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Usuario</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "El usuario es requerido",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.email && styles.inputWrapperError,
                      ]}
                    >
                      <Text style={styles.inputIcon}>👤</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="admin"
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="username"
                        textContentType="username"
                      />
                    </View>
                  )}
                />
                {errors.email && (
                  <Text style={styles.errorText}>
                    ❌ {errors.email.message}
                  </Text>
                )}
              </View>

              {/* Campo de contraseña */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contraseña</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: "La contraseña es requerida",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      style={[
                        styles.inputWrapper,
                        errors.password && styles.inputWrapperError,
                      ]}
                    >
                      <Text style={styles.inputIcon}>🔒</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="1234"
                        placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={!showPassword}
                        autoComplete="password"
                        textContentType="password"
                      />
                      <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Text style={{ fontSize: 20 }}>
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
                {errors.password && (
                  <Text style={styles.errorText}>
                    ❌ {errors.password.message}
                  </Text>
                )}
              </View>

              {/* Botón de login */}
              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                style={[
                  styles.submitButton,
                  isSubmitting && styles.submitButtonDisabled,
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Iniciando sesión..." : "Login"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Enlaces */}
            <View style={styles.footerContainer}>
              <TouchableOpacity style={styles.linkButton}>
                <Text style={styles.linkText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
              <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.linkText}>Crear una cuenta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
