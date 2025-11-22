import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ParkampusTheme } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScheduleCard } from '@/components/profile/ScheduleCard';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro de que quieres cerrar sesión?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Cerrar Sesión",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    }
                }
            ]
        );
    };

    const getInitials = (firstName: string, lastName: string) => {
        if (!firstName && !lastName) return 'U';
        const firstInitial = firstName ? firstName[0] : '';
        const lastInitial = lastName ? lastName[0] : '';
        return `${firstInitial}${lastInitial}`.toUpperCase() || 'U';
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Perfil</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                {/* Profile Section */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatarText}>
                            {getInitials(user?.first_name || '', user?.last_name || '')}
                        </Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>
                            {user?.first_name} {user?.last_name}
                        </Text>
                        <Text style={styles.userEmail}>{user?.email || 'usuario@example.com'}</Text>
                        <View style={styles.roleBadge}>
                            <Text style={styles.roleText}>
                                {user?.user_type ? user.user_type.charAt(0).toUpperCase() + user.user_type.slice(1) : ''}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Configuración</Text>

                    <View style={styles.settingsCard}>
                        <TouchableOpacity
                            style={styles.settingRow}
                            onPress={() => router.push('/settings')}
                        >
                            <View style={styles.settingIconContainer}>
                                <IconSymbol name="bell.fill" size={20} color={ParkampusTheme.colors.main} />
                            </View>
                            <View style={styles.settingInfo}>
                                <Text style={styles.settingLabel}>Notificaciones</Text>
                                <Text style={styles.settingDescription}>Configurar preferencias de notificaciones</Text>
                            </View>
                            <IconSymbol name="chevron.right" size={20} color={ParkampusTheme.colors.gray} />
                        </TouchableOpacity>

                        {/* Only show schedule configuration for non-guards */}
                        {user?.user_type?.toLowerCase() !== 'celador' && (
                            <>
                                <View style={styles.divider} />

                                <TouchableOpacity
                                    style={styles.settingRow}
                                    onPress={() => router.push('/schedule')}
                                >
                                    <View style={styles.settingIconContainer}>
                                        <IconSymbol name="calendar" size={20} color={ParkampusTheme.colors.main} />
                                    </View>
                                    <View style={styles.settingInfo}>
                                        <Text style={styles.settingLabel}>Configurar Horario</Text>
                                        <Text style={styles.settingDescription}>Define tu horario semanal de asistencia</Text>
                                    </View>
                                    <IconSymbol name="chevron.right" size={20} color={ParkampusTheme.colors.gray} />
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>

                {/* Schedule Section - Only for non-guards */}
                {user?.user_type?.toLowerCase() !== 'celador' && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mi horario</Text>
                        <View style={styles.scheduleDisplayCard}>
                            {user && <ScheduleCard user={user} />}
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Logout Button - Fixed at bottom */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <IconSymbol name="arrow.right.square" size={20} color={ParkampusTheme.colors.danger} />
                    <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ParkampusTheme.colors.background,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: ParkampusTheme.colors.cardBorder,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
    },
    avatarContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: ParkampusTheme.colors.main,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 8,
    },
    roleBadge: {
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        alignSelf: 'flex-start',
    },
    roleText: {
        fontSize: 12,
        color: ParkampusTheme.colors.main,
        fontWeight: '600',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 12,
        marginLeft: 4,
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
    },
    scheduleDisplayCard: {
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
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0F2FE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
    logoutContainer: {
        padding: 20,
        paddingBottom: 90,
        backgroundColor: ParkampusTheme.colors.background,
        borderTopWidth: 1,
        borderTopColor: ParkampusTheme.colors.cardBorder,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    logoutText: {
        color: ParkampusTheme.colors.danger,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
});
