import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { IconSymbol, IconSymbolName } from "@/components/ui/icon-symbol";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    iconName: IconSymbolName;
    children: React.ReactNode;
    footer?: React.ReactNode;
    showBackButton?: boolean;
}

export function AuthLayout({
    title,
    subtitle,
    iconName,
    children,
    footer,
    showBackButton = false,
}: AuthLayoutProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

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
        headerContainer: {
            alignItems: "center",
            marginBottom: 40,
            position: "relative",
        },
        backButton: {
            position: "absolute",
            left: 0,
            top: 0,
            padding: 8,
            zIndex: 10,
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
        footerContainer: {
            alignItems: "center",
            marginTop: 24,
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
                        {showBackButton && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <IconSymbol
                                    name="chevron.left"
                                    size={28}
                                    color={isDark ? "#FFFFFF" : "#1F2937"}
                                />
                            </TouchableOpacity>
                        )}
                        <View style={styles.headerContainer}>
                            <View style={styles.iconContainer}>
                                <IconSymbol name={iconName} size={50} color="#FFFFFF" />
                            </View>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>{subtitle}</Text>
                        </View>

                        <View style={styles.formContainer}>{children}</View>

                        {footer && (
                            <View style={styles.footerContainer}>{footer}</View>
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
