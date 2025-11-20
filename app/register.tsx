import { IconSymbol } from "@/components/ui/icon-symbol";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import {
    registerUser,
    RegisterUserData,
    ApiError,
} from "@/services/userService";

// Tipos para el formulario
type RegisterFormData = {
    nombre: string;
    apellido: string;
    correo: string;
    password: string;
    confirmPassword: string;
    rol: string;
};

export default function RegisterScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showRolPicker, setShowRolPicker] = useState(false);

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
            confirmPassword: "",
            rol: "",
        },
    });

    const password = watch("password");
    const selectedRol = watch("rol");

    // Opciones de rol
    const roleOptions = [
        { label: "Celador", value: "celador", emoji: "👮" },
        { label: "Estudiante", value: "estudiante", emoji: "🎓" },
        { label: "Empleado", value: "empleado", emoji: "💼" },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        try {
            // Preparar el body según el formato del API
            const userData: RegisterUserData = {
                first_name: data.nombre,
                last_name: data.apellido,
                email: data.correo,
                password: data.password,
                user_type: data.rol as "celador" | "estudiante" | "empleado",
            };

            // Hacer la petición al servicio
            const response = await registerUser(userData);

            // Si la respuesta es exitosa
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
            // Manejar errores usando el tipo ApiError
            const apiError = error as ApiError;
            Alert.alert("Error", apiError.message);
            console.error("Error en el registro:", error);
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
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        // Header
        headerContainer: {
            alignItems: "center",
            marginBottom: 32,
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
        inputContainer: {
            marginBottom: 16,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: "600",
            color: isDark ? "#F3F4F6" : "#374151",
            marginBottom: 8,
        },
        required: {
            color: "#DC2626",
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
        pickerContainer: {
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            borderRadius: 8,
            backgroundColor: isDark ? "#111827" : "#F9FAFB",
            overflow: "hidden",
        },
        pickerContainerError: {
            borderColor: "#DC2626",
            backgroundColor: isDark ? "#1F1416" : "#FEF2F2",
        },
        picker: {
            height: 48,
            color: isDark ? "#FFFFFF" : "#111827",
        },
        // Selector iOS personalizado
        customPickerButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            borderRadius: 8,
            backgroundColor: isDark ? "#111827" : "#F9FAFB",
            paddingHorizontal: 12,
            height: 48,
        },
        customPickerButtonError: {
            borderColor: "#DC2626",
            backgroundColor: isDark ? "#1F1416" : "#FEF2F2",
        },
        customPickerButtonContent: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        customPickerEmoji: {
            fontSize: 20,
            marginRight: 8,
        },
        customPickerText: {
            fontSize: 15,
            color: isDark ? "#FFFFFF" : "#111827",
        },
        customPickerPlaceholder: {
            fontSize: 15,
            color: isDark ? "#6B7280" : "#9CA3AF",
        },
        customPickerArrow: {
            fontSize: 16,
            color: isDark ? "#9CA3AF" : "#6B7280",
        },
        // Modal para iOS
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
        },
        modalContent: {
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: Platform.OS === "ios" ? 34 : 20,
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: isDark ? "#FFFFFF" : "#1F2937",
        },
        modalCloseButton: {
            padding: 4,
        },
        modalCloseText: {
            fontSize: 16,
            color: ParkampusTheme.colors.main,
            fontWeight: "600",
        },
        modalOptions: {
            maxHeight: 300,
        },
        modalOption: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
        },
        modalOptionSelected: {
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
        },
        modalOptionEmoji: {
            fontSize: 24,
            marginRight: 12,
        },
        modalOptionText: {
            fontSize: 16,
            color: isDark ? "#FFFFFF" : "#1F2937",
            flex: 1,
        },
        modalOptionCheck: {
            fontSize: 20,
            color: ParkampusTheme.colors.main,
        },
        helperText: {
            fontSize: 12,
            color: isDark ? "#9CA3AF" : "#6B7280",
            marginTop: 4,
        },
        errorText: {
            fontSize: 13,
            color: "#DC2626",
            marginTop: 4,
            flexDirection: "row",
            alignItems: "center",
        },
        passwordRequirements: {
            marginTop: 8,
            padding: 12,
            backgroundColor: isDark ? "#111827" : "#F3F4F6",
            borderRadius: 8,
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
            marginBottom: 32,
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
    });

    const hasErrors = Object.keys(errors).length > 0;

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
                                <IconSymbol name="paperplane.fill" size={50} color="#FFFFFF" />
                            </View>
                            <Text style={styles.title}>Registro de Usuario</Text>
                            <Text style={styles.subtitle}>Parqueadero Pascual Bravo</Text>
                        </View>

                        {/* Formulario */}
                        <View style={styles.formContainer}>
                            {hasErrors && (
                                <View style={styles.errorBanner}>
                                    <Text style={{ fontSize: 18 }}>⚠️</Text>
                                    <Text style={styles.errorBannerText}>
                                        Faltan campos por llenar
                                    </Text>
                                </View>
                            )}

                            {/* Nombre */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Nombre <Text style={styles.required}>*</Text>
                                </Text>
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
                                        <View
                                            style={[
                                                styles.inputWrapper,
                                                errors.nombre && styles.inputWrapperError,
                                            ]}
                                        >
                                            <Text style={styles.inputIcon}>👤</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Ingresa tu nombre"
                                                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                autoCapitalize="words"
                                            />
                                        </View>
                                    )}
                                />
                                {errors.nombre && (
                                    <Text style={styles.errorText}>
                                        ❌ {errors.nombre.message}
                                    </Text>
                                )}
                            </View>

                            {/* Apellido */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Apellido <Text style={styles.required}>*</Text>
                                </Text>
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
                                        <View
                                            style={[
                                                styles.inputWrapper,
                                                errors.apellido && styles.inputWrapperError,
                                            ]}
                                        >
                                            <Text style={styles.inputIcon}>👤</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Ingresa tu apellido"
                                                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                autoCapitalize="words"
                                            />
                                        </View>
                                    )}
                                />
                                {errors.apellido && (
                                    <Text style={styles.errorText}>
                                        ❌ {errors.apellido.message}
                                    </Text>
                                )}
                            </View>

                            {/* Correo institucional */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Correo institucional <Text style={styles.required}>*</Text>
                                </Text>
                                <Controller
                                    control={control}
                                    name="correo"
                                    rules={{
                                        required: "Este campo es requerido",
                                        pattern: {
                                            value: /@pascualbravo\.edu\.co$/,
                                            message: "Debe ser un correo @pascualbravo.edu.co",
                                        },
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View
                                            style={[
                                                styles.inputWrapper,
                                                errors.correo && styles.inputWrapperError,
                                            ]}
                                        >
                                            <Text style={styles.inputIcon}>📧</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="usuario@pascualbravo.edu.co"
                                                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                            />
                                        </View>
                                    )}
                                />
                                <Text style={styles.helperText}>
                                    Usa tu correo institucional (@pascualbravo.edu.co)
                                </Text>
                                {errors.correo && (
                                    <Text style={styles.errorText}>
                                        ❌ {errors.correo.message}
                                    </Text>
                                )}
                            </View>

                            {/* Rol */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Rol <Text style={styles.required}>*</Text>
                                </Text>
                                <Controller
                                    control={control}
                                    name="rol"
                                    rules={{
                                        required: "Debes seleccionar un rol",
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            {Platform.OS === "ios" ? (
                                                // Selector personalizado para iOS
                                                <TouchableOpacity
                                                    style={[
                                                        styles.customPickerButton,
                                                        errors.rol && styles.customPickerButtonError,
                                                    ]}
                                                    onPress={() => setShowRolPicker(true)}
                                                >
                                                    <View style={styles.customPickerButtonContent}>
                                                        {value ? (
                                                            <>
                                                                <Text style={styles.customPickerEmoji}>
                                                                    {roleOptions.find((r) => r.value === value)
                                                                        ?.emoji || ""}
                                                                </Text>
                                                                <Text style={styles.customPickerText}>
                                                                    {roleOptions.find((r) => r.value === value)
                                                                        ?.label || ""}
                                                                </Text>
                                                            </>
                                                        ) : (
                                                            <Text style={styles.customPickerPlaceholder}>
                                                                Selecciona tu rol
                                                            </Text>
                                                        )}
                                                    </View>
                                                    <Text style={styles.customPickerArrow}>▼</Text>
                                                </TouchableOpacity>
                                            ) : (
                                                // Picker nativo para Android
                                                <View
                                                    style={[
                                                        styles.pickerContainer,
                                                        errors.rol && styles.pickerContainerError,
                                                    ]}
                                                >
                                                    <Picker
                                                        selectedValue={value}
                                                        onValueChange={onChange}
                                                        style={styles.picker}
                                                        dropdownIconColor={isDark ? "#FFFFFF" : "#111827"}
                                                    >
                                                        <Picker.Item label="Selecciona tu rol" value="" />
                                                        <Picker.Item label="👮 Celador" value="celador" />
                                                        <Picker.Item
                                                            label="🎓 Estudiante"
                                                            value="estudiante"
                                                        />
                                                        <Picker.Item label="💼 Empleado" value="empleado" />
                                                    </Picker>
                                                </View>
                                            )}

                                            {/* Modal para iOS */}
                                            {Platform.OS === "ios" && (
                                                <Modal
                                                    visible={showRolPicker}
                                                    transparent={true}
                                                    animationType="slide"
                                                    onRequestClose={() => setShowRolPicker(false)}
                                                >
                                                    <TouchableOpacity
                                                        style={styles.modalOverlay}
                                                        activeOpacity={1}
                                                        onPress={() => setShowRolPicker(false)}
                                                    >
                                                        <View
                                                            style={styles.modalContent}
                                                            onStartShouldSetResponder={() => true}
                                                        >
                                                            <View style={styles.modalHeader}>
                                                                <Text style={styles.modalTitle}>
                                                                    Selecciona tu rol
                                                                </Text>
                                                                <TouchableOpacity
                                                                    style={styles.modalCloseButton}
                                                                    onPress={() => setShowRolPicker(false)}
                                                                >
                                                                    <Text style={styles.modalCloseText}>
                                                                        Listo
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                            <ScrollView style={styles.modalOptions}>
                                                                {roleOptions.map((option) => (
                                                                    <TouchableOpacity
                                                                        key={option.value}
                                                                        style={[
                                                                            styles.modalOption,
                                                                            value === option.value &&
                                                                            styles.modalOptionSelected,
                                                                        ]}
                                                                        onPress={() => {
                                                                            onChange(option.value);
                                                                            setShowRolPicker(false);
                                                                        }}
                                                                    >
                                                                        <Text style={styles.modalOptionEmoji}>
                                                                            {option.emoji}
                                                                        </Text>
                                                                        <Text style={styles.modalOptionText}>
                                                                            {option.label}
                                                                        </Text>
                                                                        {value === option.value && (
                                                                            <Text style={styles.modalOptionCheck}>
                                                                                ✓
                                                                            </Text>
                                                                        )}
                                                                    </TouchableOpacity>
                                                                ))}
                                                            </ScrollView>
                                                        </View>
                                                    </TouchableOpacity>
                                                </Modal>
                                            )}
                                        </>
                                    )}
                                />
                                {errors.rol && (
                                    <Text style={styles.errorText}>❌ {errors.rol.message}</Text>
                                )}
                            </View>

                            {/* Contraseña */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Contraseña <Text style={styles.required}>*</Text>
                                </Text>
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
                                                /[A-Z]/.test(value) ||
                                                "Debe contener una letra mayúscula",
                                            hasLowerCase: (value) =>
                                                /[a-z]/.test(value) ||
                                                "Debe contener una letra minúscula",
                                            hasNumber: (value) =>
                                                /\d/.test(value) || "Debe contener un número",
                                            hasSpecialChar: (value) =>
                                                /[!@#$%^&*(),.?":{}|<>]/.test(value) ||
                                                "Debe contener un carácter especial",
                                        },
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
                                                placeholder="Crea una contraseña segura"
                                                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showPassword}
                                                autoCapitalize="none"
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
                                <View style={styles.passwordRequirements}>
                                    <Text style={styles.requirementTitle}>
                                        La contraseña debe contener:
                                    </Text>
                                    <View style={styles.requirementItem}>
                                        <Text>{password?.length >= 8 ? "✅" : "⭕"}</Text>
                                        <Text style={styles.requirementText}>
                                            Mínimo 8 caracteres
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text>{/[A-Z]/.test(password || "") ? "✅" : "⭕"}</Text>
                                        <Text style={styles.requirementText}>
                                            Una letra mayúscula
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text>{/[a-z]/.test(password || "") ? "✅" : "⭕"}</Text>
                                        <Text style={styles.requirementText}>
                                            Una letra minúscula
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text>{/\d/.test(password || "") ? "✅" : "⭕"}</Text>
                                        <Text style={styles.requirementText}>Un número</Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text>
                                            {/[!@#$%^&*(),.?":{}|<>]/.test(password || "")
                                                ? "✅"
                                                : "⭕"}
                                        </Text>
                                        <Text style={styles.requirementText}>
                                            Un carácter especial
                                        </Text>
                                    </View>
                                </View>
                                {errors.password && (
                                    <Text style={styles.errorText}>
                                        ❌ {errors.password.message}
                                    </Text>
                                )}
                            </View>

                            {/* Confirmar contraseña */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>
                                    Confirmar contraseña <Text style={styles.required}>*</Text>
                                </Text>
                                <Controller
                                    control={control}
                                    name="confirmPassword"
                                    rules={{
                                        required: "Debes confirmar tu contraseña",
                                        validate: (value) =>
                                            value === password || "Las contraseñas no coinciden",
                                    }}
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <View
                                            style={[
                                                styles.inputWrapper,
                                                errors.confirmPassword && styles.inputWrapperError,
                                            ]}
                                        >
                                            <Text style={styles.inputIcon}>🔒</Text>
                                            <TextInput
                                                style={styles.textInput}
                                                placeholder="Confirma tu contraseña"
                                                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                                                value={value}
                                                onChangeText={onChange}
                                                onBlur={onBlur}
                                                secureTextEntry={!showConfirmPassword}
                                                autoCapitalize="none"
                                            />
                                            <TouchableOpacity
                                                style={styles.eyeButton}
                                                onPress={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                            >
                                                <Text style={{ fontSize: 20 }}>
                                                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                />
                                {errors.confirmPassword && (
                                    <Text style={styles.errorText}>
                                        ❌ {errors.confirmPassword.message}
                                    </Text>
                                )}
                            </View>

                            {/* Botón de registro */}
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
                                    {isSubmitting ? "Registrando..." : "Registrar"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View style={styles.footerContainer}>
                            <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
                            <TouchableOpacity
                                style={styles.linkButton}
                                onPress={() => router.push("/login")}
                            >
                                <Text style={styles.linkText}>Iniciar sesión</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
