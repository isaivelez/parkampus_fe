import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useState, useEffect, useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';
import { Notification, NotificationHistoryResponse } from '@/types/notification';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

import { CreateNotificationModal } from '@/components/notifications/CreateNotificationModal';
import { useAuth } from '@/contexts/AuthContext';

export default function NotificacionesScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchNotifications = useCallback(async () => {
        // Don't fetch if user is not authenticated
        if (!user) {
            setLoading(false);
            setRefreshing(false);
            return;
        }

        try {
            console.log('📱 Fetching notifications for user:', user?.email, 'Type:', user?.user_type);
            const response = await api.get<NotificationHistoryResponse>(API_ENDPOINTS.NOTIFICATIONS_HISTORY);
            console.log('📬 Notifications response:', response.data);
            if (response.data.success) {
                setNotifications(response.data.data);
                console.log('✅ Loaded', response.data.data.length, 'notifications');
            }
        } catch (error) {
            console.error('❌ Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'CIERRE_NOCTURNO': return 'moon.fill';
            case 'LIBERACION_HORA_PICO': return 'car.fill';
            case 'CIERRE_SEGURIDAD': return 'exclamationmark.triangle.fill';
            case 'EVENTO_INSTITUCIONAL': return 'calendar.badge.exclamationmark';
            case 'MANTENIMIENTO_EMERGENCIA': return 'wrench.and.screwdriver.fill';
            default: return 'bell.fill';
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'CIERRE_NOCTURNO': return '#1E293B'; // Slate 800
            case 'LIBERACION_HORA_PICO': return ParkampusTheme.colors.success;
            case 'CIERRE_SEGURIDAD': return ParkampusTheme.colors.danger;
            case 'EVENTO_INSTITUCIONAL': return ParkampusTheme.colors.main;
            case 'MANTENIMIENTO_EMERGENCIA': return ParkampusTheme.colors.warning;
            default: return ParkampusTheme.colors.gray;
        }
    };

    const formatTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: es });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header similar al Home */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <IconSymbol name="bell.fill" size={20} color="white" />
                        </View>
                        <Text style={styles.headerTitle}>Notificaciones</Text>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ParkampusTheme.colors.main} />
                    }
                >
                    {/* Status Bar */}
                    <View style={styles.statusBar}>
                        <View style={styles.statusBadge}>
                            <IconSymbol name="wifi" size={12} color={ParkampusTheme.colors.success} />
                            <Text style={styles.statusText}>Conectado</Text>
                        </View>
                        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                            <IconSymbol name="arrow.clockwise" size={14} color={ParkampusTheme.colors.main} />
                            <Text style={styles.refreshText}>Actualizar</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.lastUpdated}>
                        Actualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>

                    {loading && !refreshing ? (
                        <ActivityIndicator size="large" color={ParkampusTheme.colors.main} style={{ marginTop: 20 }} />
                    ) : (
                        <>
                            {notifications.map((notificacion) => (
                                <TouchableOpacity
                                    key={notificacion._id}
                                    style={styles.notificationCard}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.cardHeader}>
                                        <View style={[
                                            styles.iconContainer,
                                            { backgroundColor: getTipoColor(notificacion.type) + '20' } // 20% opacity
                                        ]}>
                                            <IconSymbol
                                                name={getTipoIcon(notificacion.type) as any}
                                                size={24}
                                                color={getTipoColor(notificacion.type)}
                                            />
                                        </View>
                                        <View style={styles.headerTextContainer}>
                                            <Text style={styles.notificationTitle}>{notificacion.subject}</Text>
                                            <Text style={styles.notificationTime}>{formatTime(notificacion.created_at)}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}

                            {notifications.length === 0 && (
                                <View style={styles.emptyContainer}>
                                    <IconSymbol name="bell.slash" size={48} color={ParkampusTheme.colors.gray} />
                                    <Text style={styles.emptyTitle}>No hay notificaciones</Text>
                                    <Text style={styles.emptyMessage}>
                                        Te avisaremos cuando haya novedades importantes.
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>

                {/* Botón flotante para celadores */}
                {user?.user_type === 'celador' && (
                    <View style={styles.stickyButtonContainer}>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={() => setModalVisible(true)}
                            activeOpacity={0.8}
                        >
                            <IconSymbol name="plus.circle.fill" size={24} color="white" />
                            <Text style={styles.createButtonText}>Crear notificación</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <CreateNotificationModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSuccess={() => {
                        // Aquí podrías recargar las notificaciones si vinieran del backend
                        onRefresh();
                    }}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: ParkampusTheme.colors.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoContainer: {
        width: 40,
        height: 40,
        backgroundColor: ParkampusTheme.colors.main,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
    badgeContainer: {
        backgroundColor: ParkampusTheme.colors.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    notificationCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
    },
    notificationUnread: {
        borderColor: ParkampusTheme.colors.main,
        borderLeftWidth: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerTextContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 2,
    },
    notificationTime: {
        fontSize: 12,
        color: ParkampusTheme.colors.gray,
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ParkampusTheme.colors.main,
        marginLeft: 8,
    },
    notificationMessage: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
        lineHeight: 20,
        paddingLeft: 52, // Align with text, skipping icon
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.textSecondary,
    },
    emptyMessage: {
        fontSize: 14,
        color: ParkampusTheme.colors.gray,
        textAlign: 'center',
        maxWidth: '80%',
    },
    stickyButtonContainer: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    createButton: {
        backgroundColor: ParkampusTheme.colors.main,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        gap: 8,
        width: '100%',
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    statusText: {
        color: ParkampusTheme.colors.success,
        fontSize: 12,
        fontWeight: '600',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    refreshText: {
        color: ParkampusTheme.colors.main,
        fontSize: 12,
        fontWeight: '600',
    },
    lastUpdated: {
        color: ParkampusTheme.colors.gray,
        fontSize: 12,
        marginBottom: 20,
        marginLeft: 4,
    },
});
