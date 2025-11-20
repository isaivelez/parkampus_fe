import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
    return (
        <>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Home' }} />
                <Stack.Screen name="details" options={{ title: 'Details' }} />
            </Stack>
            <StatusBar style="auto" />
        </>
    );
}
