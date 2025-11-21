import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificacionesScreen() {
    const [refreshing, setRefreshing] = useState(false);

    // Datos de ejemplo para las notificaciones
    const notificaciones = [
        {
            id: 1,
            tipo: 'reserva',
            titulo: 'Reserva confirmada',
            mensaje: 'Tu reserva para el espacio A-01 ha sido confirmada',
            tiempo: 'Hace 5 minutos',
            leida: false,
        },
        {
            id: 2,
            tipo: 'mantenimiento',
            titulo: 'Mantenimiento programado',
            mensaje: 'El espacio B-04 estará en mantenimiento mañana',
            tiempo: 'Hace 1 hora',
            leida: false,
        },
        {
            id: 3,
            tipo: 'disponibilidad',
            titulo: 'Nuevo espacio disponible',
            mensaje: 'El espacio C-02 ya está disponible para reservar',
            tiempo: 'Hace 2 horas',
            leida: true,
        },
        {
            id: 4,
            tipo: 'sistema',
            titulo: 'Actualización del sistema',
            mensaje: 'Parkampus se actualizará esta noche a las 23:00',
            tiempo: 'Hace 3 horas',
            leida: true,
        },
        {
            id: 5,
            tipo: 'vencimiento',
            titulo: 'Reserva por vencer',
            mensaje: 'Tu reserva en A-03 vence en 30 minutos',
            tiempo: 'Hace 4 horas',
            leida: true,
        },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        // Simular carga
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'reserva': return 'checkmark.circle.fill';
            case 'mantenimiento': return 'wrench.and.screwdriver.fill';
            case 'disponibilidad': return 'car.fill';
            case 'sistema': return 'gearshape.fill';
            case 'vencimiento': return 'clock.fill';
            default: return 'bell.fill';
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'reserva': return ParkampusTheme.colors.success;
            case 'mantenimiento': return ParkampusTheme.colors.warning;
            case 'disponibilidad': return ParkampusTheme.colors.main;
            case 'sistema': return '#6366F1';
            case 'vencimiento': return ParkampusTheme.colors.danger;
            default: return ParkampusTheme.colors.gray;
        }
    };

    const noLeidas = notificaciones.filter(n => !n.leida).length;

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
                    {noLeidas > 0 && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>{noLeidas} nuevas</Text>
                        </View>
                    )}
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ParkampusTheme.colors.main} />
                    }
                >
                    <View style={styles.contentContainer}>
                        {notificaciones.map((notificacion) => (
                            <TouchableOpacity
                                key={notificacion.id}
                                style={[
                                    styles.notificationCard,
                                    !notificacion.leida && styles.notificationUnread
                                ]}
                                activeOpacity={0.7}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={[
                                        styles.iconContainer,
                                        { backgroundColor: getTipoColor(notificacion.tipo) + '20' } // 20% opacity
                                    ]}>
                                        <IconSymbol
                                            name={getTipoIcon(notificacion.tipo) as any}
                                            size={24}
                                            color={getTipoColor(notificacion.tipo)}
                                        />
                                    </View>
                                    <View style={styles.headerTextContainer}>
                                        <Text style={styles.notificationTitle}>{notificacion.titulo}</Text>
                                        <Text style={styles.notificationTime}>{notificacion.tiempo}</Text>
                                    </View>
                                    {!notificacion.leida && (
                                        <View style={styles.unreadDot} />
                                    )}
                                </View>
                                <Text style={styles.notificationMessage}>
                                    {notificacion.mensaje}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        {notificaciones.length === 0 && (
                            <View style={styles.emptyContainer}>
                                <IconSymbol name="bell.slash" size={48} color={ParkampusTheme.colors.gray} />
                                <Text style={styles.emptyTitle}>No hay notificaciones</Text>
                                <Text style={styles.emptyMessage}>
                                    Te avisaremos cuando haya novedades importantes.
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
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
});
