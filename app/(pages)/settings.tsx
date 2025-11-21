import React, { useState } from 'react';
import { StyleSheet, Text, View, Switch, ScrollView } from 'react-native';
import { ParkampusTheme } from '@/constants/theme';
import { Stack } from 'expo-router';

export default function SettingsScreen() {
    // Mock states for notification settings
    const [pushEnabled, setPushEnabled] = useState(true);
    const [alertsEnabled, setAlertsEnabled] = useState(true);
    const [remindersEnabled, setRemindersEnabled] = useState(false);

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
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Notificaciones Push</Text>
                                <Text style={styles.settingDescription}>Recibir alertas en tu dispositivo</Text>
                            </View>
                            <Switch
                                value={pushEnabled}
                                onValueChange={setPushEnabled}
                                trackColor={{ false: ParkampusTheme.colors.lightGray, true: ParkampusTheme.colors.mainLight }}
                                thumbColor={pushEnabled ? ParkampusTheme.colors.main : '#f4f3f4'}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Alertas de Disponibilidad</Text>
                                <Text style={styles.settingDescription}>Avisar cuando haya pocos cupos disponibles</Text>
                            </View>
                            <Switch
                                value={alertsEnabled}
                                onValueChange={setAlertsEnabled}
                                trackColor={{ false: ParkampusTheme.colors.lightGray, true: ParkampusTheme.colors.mainLight }}
                                thumbColor={alertsEnabled ? ParkampusTheme.colors.main : '#f4f3f4'}
                            />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Recordatorios de Reserva</Text>
                                <Text style={styles.settingDescription}>Recordar mis reservas activas</Text>
                            </View>
                            <Switch
                                value={remindersEnabled}
                                onValueChange={setRemindersEnabled}
                                trackColor={{ false: ParkampusTheme.colors.lightGray, true: ParkampusTheme.colors.mainLight }}
                                thumbColor={remindersEnabled ? ParkampusTheme.colors.main : '#f4f3f4'}
                            />
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            💡 Estas configuraciones actualmente no están conectadas al backend. Los cambios se guardarán localmente.
                        </Text>
                    </View>
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
