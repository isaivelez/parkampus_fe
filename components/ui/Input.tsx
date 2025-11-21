import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
    icon?: string;
    isPassword?: boolean;
    containerStyle?: ViewStyle;
}

export function Input({
    label,
    error,
    icon,
    isPassword = false,
    containerStyle,
    style,
    ...props
}: InputProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [showPassword, setShowPassword] = useState(false);

    const styles = StyleSheet.create({
        inputContainer: {
            marginBottom: 16,
            ...containerStyle,
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
            fontSize: 16,
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
    });

    return (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View
                style={[
                    styles.inputWrapper,
                    !!error && styles.inputWrapperError,
                ]}
            >
                {icon && <Text style={styles.inputIcon}>{icon}</Text>}
                <TextInput
                    style={[styles.textInput, style]}
                    placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                    secureTextEntry={isPassword && !showPassword}
                    {...props}
                />
                {isPassword && (
                    <TouchableOpacity
                        style={styles.eyeButton}
                        onPress={() => setShowPassword(!showPassword)}
                    >
                        <Text style={{ fontSize: 20 }}>
                            {showPassword ? "👁️" : "👁️‍🗨️"}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>❌ {error}</Text>}
        </View>
    );
}
