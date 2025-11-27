import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { ParkampusTheme } from '@/constants/theme';
import { Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser } from '@/services/userService';

const NOTIFICATION_TYPES = [
    {
        key: 'CIERRE_NOCTURNO' as const,
        label: 'Cierre Nocturno',
        description: 'Recordatorio de cierre a las 10:00 PM',
        icon: '🌙',
    },
    {
        key: 'LIBERACION_HORA_PICO' as const,
        label: 'Liberación en Hora Pico',
        description: 'Solicitud para liberar espacios',
        icon: '🚗',
    },
    {
        key: 'CIERRE_SEGURIDAD' as const,
        label: 'Cierre por Seguridad',
        description: 'Evacuación preventiva',
        icon: '⚠️',
    },
    {
        key: 'EVENTO_INSTITUCIONAL' as const,
        label: 'Evento Institucional',
        description: 'Restricciones por evento masivo',
        icon: '🎉',
    },
    {
        key: 'MANTENIMIENTO_EMERGENCIA' as const,
        label: 'Mantenimiento de Emergencia',
        description: 'Cierre parcial por obras',
        icon: '🛠️',
    },
];

export default function SettingsScreen() {
    const { user, setUser, token } = useAuth();
    const [preferences, setPreferences] = useState<Record<string, boolean>>({});
    const [saving, setSaving] = useState(false);

    // Initialize preferences from user data
    useEffect(() => {
        if (user?.notification_preferences) {
            setPreferences(user.notification_preferences);
        } else {
            // If no preferences exist, initialize as empty object (toggles will show as false)
            setPreferences({});
        }
    }, [user]);

    const handleToggle = async (key: string, value: boolean) => {
        if (!user || !token) return;

        // Optimistically update UI
        const newPreferences = { ...preferences, [key]: value };
        setPreferences(newPreferences);

        // Save to backend
        setSaving(true);
        try {
            const response = await updateUser(user._id, {
                notification_preferences: newPreferences,
            });

            if (response.success && response.data) {
                // Update user context with new data AND preserve the token
                setUser(response.data, token);
                console.log('✅ Notification preferences saved');
            }
        } catch (error) {
            console.error('❌ Error saving preferences:', error);
            // Revert on error
            setPreferences(preferences);
            Alert.alert('Error', 'No se pudieron guardar las preferencias. Intenta de nuevo.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: 'Configuración de Notificaciones', headerShown: true }} />
            <View style={styles.container}>
                <ScrollView style={styles.content}>
                    <View style={styles.section}>
                        <Text style={styles.sectionDescription}>
                            Configura tus preferencias de notificaciones para personalizar tu experiencia.
                        </Text>
                    </View>

                    <View style={styles.settingsCard}>
                        {NOTIFICATION_TYPES.map((type, index) => (
                            <React.Fragment key={type.key}>
                                <View style={styles.settingRow}>
                                    <View style={styles.settingInfo}>
                                        <Text style={styles.settingLabel}>
                                            {type.icon} {type.label}
                                        </Text>
                                        <Text style={styles.settingDescription}>{type.description}</Text>
                                    </View>
                                    <Switch
                                        value={preferences[type.key] ?? false}
                                        onValueChange={(value) => handleToggle(type.key, value)}
                                        trackColor={{ false: ParkampusTheme.colors.lightGray, true: ParkampusTheme.colors.mainLight }}
                                        thumbColor={preferences[type.key] ? ParkampusTheme.colors.main : '#f4f3f4'}
                                        disabled={saving}
                                    />
                                </View>
                                {index < NOTIFICATION_TYPES.length - 1 && <View style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </View>

                    {saving && (
                        <View style={styles.savingIndicator}>
                            <ActivityIndicator size="small" color={ParkampusTheme.colors.main} />
                            <Text style={styles.savingText}>Guardando...</Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ParkampusTheme.colors.background,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionDescription: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
        lineHeight: 20,
    },
    settingsCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
        marginBottom: 20,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingInfo: {
        flex: 1,
        paddingRight: 16,
    },
    settingLabel: {
        fontSize: 16,
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 12,
        color: ParkampusTheme.colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: ParkampusTheme.colors.lightGray,
        marginVertical: 12,
    },
    savingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        gap: 8,
    },
    savingText: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
    },
    infoBox: {
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: ParkampusTheme.colors.main,
    },
    infoText: {
        fontSize: 13,
        color: ParkampusTheme.colors.textSecondary,
        lineHeight: 18,
    },
});
