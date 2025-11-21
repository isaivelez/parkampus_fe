import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { loginUser, ApiError } from "@/services/userService";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type LoginFormData = {
    email: string;
    password: string;
};

export function LoginForm() {
    const { setUser } = useAuth();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
            const response = await loginUser({
                email: data.email,
                password: data.password,
            });

            if (response.success && response.data?.user && response.data?.token) {
                setUser(response.data.user, response.data.token);
                Alert.alert(
                    "¡Bienvenido! 🎉",
                    `${response.data.user.first_name} ${response.data.user.last_name}\n${response.message}`,
                    [
                        {
                            text: "Continuar",
                            onPress: () => router.replace("/(tabs)"),
                        },
                    ]
                );
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert("Error de autenticación", apiError.message);
            console.error("Error en el login:", error);
        }
    };

    const styles = StyleSheet.create({
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
            height: 1,
            width: "100%",
            backgroundColor: isDark ? "#374151" : "#E5E7EB",
        },
    });

    const Footer = (
        <>
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
        </>
    );

    return (
        <AuthLayout
            title="Login"
            subtitle="Bienvenido de vuelta a Parkampus"
            iconName="car.fill"
            footer={Footer}
        >
            <Controller
                control={control}
                name="email"
                rules={{
                    required: "El correo es requerido",
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Ingresa un correo válido",
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Correo electrónico"
                        placeholder="usuario@pascualbravo.edu.co"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.email?.message}
                        icon="📧"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{
                    required: "La contraseña es requerida",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Contraseña"
                        placeholder="Ingresa tu contraseña"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        icon="🔒"
                        isPassword
                    />
                )}
            />

            <Button
                title="Login"
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                loadingText="Iniciando sesión..."
            />
        </AuthLayout>
    );
}
