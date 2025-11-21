import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router } from "expo-router";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { AuthLayout } from "@/components/auth/AuthLayout";
import {
    registerUser,
    RegisterUserData,
    ApiError,
} from "@/services/userService";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { PASCUAL_BRAVO_EMAIL_REGEX, validatePassword } from "@/utils/validations";

type RegisterFormData = {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    rol: string;
};

export function RegisterForm() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        defaultValues: {
            nombre: "",
            apellido: "",
            correo: "",
            password: "",
            rol: "",
        },
    });

    const password = watch("password");

    const roleOptions = [
        { label: "Estudiante", value: "estudiante", emoji: "🎓" },
        { label: "Empleado", value: "empleado", emoji: "💼" },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        try {
            const userData: RegisterUserData = {
                first_name: data.nombre,
                last_name: data.apellido,
                email: data.correo,
                password: data.password,
                user_type: data.rol as "estudiante" | "empleado",
            };

            const response = await registerUser(userData);

            if (response.success) {
                Alert.alert(
                    "¡Registro exitoso! 🎉",
                    `Bienvenido ${data.nombre} ${data.apellido}!\nRol: ${data.rol}`,
                    [
                        {
                            text: "Continuar",
                            onPress: () => router.replace("/login"),
                        },
                    ]
                );
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert("Error", apiError.message);
            console.error("Error en el registro:", error);
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
        errorBanner: {
            backgroundColor: "#FEE2E2",
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
        },
        errorBannerText: {
            color: "#DC2626",
            fontSize: 14,
            marginLeft: 8,
            flex: 1,
        },
        passwordRequirements: {
            marginTop: 8,
            padding: 12,
            backgroundColor: isDark ? "#111827" : "#F3F4F6",
            borderRadius: 8,
            marginBottom: 16,
        },
        requirementTitle: {
            fontSize: 13,
            fontWeight: "600",
            color: isDark ? "#F3F4F6" : "#374151",
            marginBottom: 6,
        },
        requirementItem: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 4,
        },
        requirementText: {
            fontSize: 12,
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginLeft: 6,
        },
    });

    const hasErrors = Object.keys(errors).length > 0;
    const passwordChecks = validatePassword(password || "");

    const Footer = (
        <>
            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity
                style={styles.linkButton}
                onPress={() => router.push("/login")}
            >
                <Text style={styles.linkText}>Iniciar sesión</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <AuthLayout
            title="Registro de Usuario"
            subtitle="Parqueadero Pascual Bravo"
            iconName="paperplane.fill"
            footer={Footer}
            showBackButton={true}
        >
            {hasErrors && (
                <View style={styles.errorBanner}>
                    <Text style={{ fontSize: 18 }}>⚠️</Text>
                    <Text style={styles.errorBannerText}>
                        Faltan campos por llenar
                    </Text>
                </View>
            )}

            <Controller
                control={control}
                name="nombre"
                rules={{
                    required: "Este campo es requerido",
                    minLength: {
                        value: 2,
                        message: "El nombre debe tener al menos 2 caracteres",
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Nombre"
                        placeholder="Ingresa tu nombre"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.nombre?.message}
                        icon="👤"
                        autoCapitalize="words"
                    />
                )}
            />

            <Controller
                control={control}
                name="apellido"
                rules={{
                    required: "Este campo es requerido",
                    minLength: {
                        value: 2,
                        message: "El apellido debe tener al menos 2 caracteres",
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Apellido"
                        placeholder="Ingresa tu apellido"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.apellido?.message}
                        icon="👤"
                        autoCapitalize="words"
                    />
                )}
            />

            <Controller
                control={control}
                name="correo"
                rules={{
                    required: "Este campo es requerido",
                    pattern: {
                        value: PASCUAL_BRAVO_EMAIL_REGEX,
                        message: "Debe ser un correo @pascualbravo.edu.co",
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Correo institucional"
                        placeholder="usuario@pascualbravo.edu.co"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.correo?.message}
                        icon="📧"
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                )}
            />

            <Controller
                control={control}
                name="rol"
                rules={{
                    required: "Debes seleccionar un rol",
                }}
                render={({ field: { onChange, value } }) => (
                    <Select
                        label="Rol"
                        value={value}
                        options={roleOptions}
                        onChange={onChange}
                        error={errors.rol?.message}
                        placeholder="Selecciona tu rol"
                    />
                )}
            />

            <Controller
                control={control}
                name="password"
                rules={{
                    required: "Este campo es requerido",
                    minLength: {
                        value: 8,
                        message: "La contraseña debe tener al menos 8 caracteres",
                    },
                    validate: {
                        hasUpperCase: (value) =>
                            /[A-Z]/.test(value) || "Debe contener una letra mayúscula",
                        hasLowerCase: (value) =>
                            /[a-z]/.test(value) || "Debe contener una letra minúscula",
                        hasNumber: (value) =>
                            /\d/.test(value) || "Debe contener un número",
                        hasSpecialChar: (value) =>
                            /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                            "Debe contener un carácter especial",
                    },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                        label="Contraseña"
                        placeholder="Crea una contraseña segura"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.password?.message}
                        icon="🔒"
                        isPassword
                    />
                )}
            />

            <View style={styles.passwordRequirements}>
                <Text style={styles.requirementTitle}>
                    La contraseña debe contener:
                </Text>
                <View style={styles.requirementItem}>
                    <Text>{passwordChecks.minLength ? "✅" : "⭕"}</Text>
                    <Text style={styles.requirementText}>Mínimo 8 caracteres</Text>
                </View>
                <View style={styles.requirementItem}>
                    <Text>{passwordChecks.hasUpperCase ? "✅" : "⭕"}</Text>
                    <Text style={styles.requirementText}>Una letra mayúscula</Text>
                </View>
                <View style={styles.requirementItem}>
                    <Text>{passwordChecks.hasLowerCase ? "✅" : "⭕"}</Text>
                    <Text style={styles.requirementText}>Una letra minúscula</Text>
                </View>
                <View style={styles.requirementItem}>
                    <Text>{passwordChecks.hasNumber ? "✅" : "⭕"}</Text>
                    <Text style={styles.requirementText}>Un número</Text>
                </View>
                <View style={styles.requirementItem}>
                    <Text>{passwordChecks.hasSpecialChar ? "✅" : "⭕"}</Text>
                    <Text style={styles.requirementText}>Un carácter especial</Text>
                </View>
            </View>

            <Button
                title="Registrarse"
                onPress={handleSubmit(onSubmit)}
                isLoading={isSubmitting}
                loadingText="Registrando..."
            />
        </AuthLayout>
    );
}
