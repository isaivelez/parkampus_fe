import React from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from "react-native";
import { ParkampusTheme } from "@/constants/theme";

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    isLoading?: boolean;
    loadingText?: string;
    variant?: "primary" | "secondary" | "outline";
}

export function Button({
    title,
    isLoading = false,
    loadingText,
    variant = "primary",
    style,
    disabled,
    ...props
}: ButtonProps) {
    const styles = StyleSheet.create({
        button: {
            height: 50,
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            flexDirection: "row",
            shadowColor: ParkampusTheme.colors.main,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
            backgroundColor: ParkampusTheme.colors.main,
        },
        buttonDisabled: {
            opacity: 0.6,
            shadowOpacity: 0,
            elevation: 0,
        },
        text: {
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: "600",
        },
    });

    return (
        <TouchableOpacity
            disabled={disabled || isLoading}
            style={[
                styles.button,
                (disabled || isLoading) && styles.buttonDisabled,
                style,
            ]}
            activeOpacity={0.8}
            {...props}
        >
            {isLoading ? (
                <>
                    <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.text}>{loadingText || title}</Text>
                </>
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}
