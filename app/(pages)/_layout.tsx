import { Stack } from "expo-router";
import { ParkampusTheme } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function PagesLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: isDark ? ParkampusTheme.colors.black : ParkampusTheme.colors.white,
                },
                headerTintColor: isDark ? "#FFFFFF" : "#000000",
                headerTitleStyle: {
                    fontWeight: "bold",
                },
            }}
        >
            <Stack.Screen
                name="modal"
                options={{
                    presentation: "modal",
                    title: "Modal",
                }}
            />
            <Stack.Screen
                name="details"
                options={{
                    title: "Detalles",
                }}
            />
            <Stack.Screen
                name="settings"
                options={{
                    title: "Configuración",
                }}
            />
        </Stack>
    );
}
