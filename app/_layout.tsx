import { useEffect } from "react";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { View, ActivityIndicator } from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

export const unstable_settings = {
    initialRouteName: "(auth)/login",
};

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { isAuthenticated, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === "(auth)";

        if (isAuthenticated && inAuthGroup) {
            // Si está autenticado y trata de entrar a login/register, redirigir al home
            router.replace("/(tabs)");
        } else if (!isAuthenticated && !inAuthGroup) {
            // Si NO está autenticado y trata de entrar a rutas protegidas, redirigir a login
            router.replace("/(auth)/login");
        }
    }, [isAuthenticated, segments, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(pages)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}

import { useNotifications } from '@/hooks/use-notifications';

export default function RootLayout() {
    useNotifications();
    return (
        <AuthProvider>
            <RootLayoutNav />
        </AuthProvider>
    );
}
