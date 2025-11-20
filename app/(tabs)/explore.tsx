import { ParkampusTheme } from '@/constants/theme';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificacionesScreen() {
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

    const getTipoIcon = (tipo: string) => {
        switch (tipo) {
            case 'reserva': return '✅';
            case 'mantenimiento': return '🔧';
            case 'disponibilidad': return '🟢';
            case 'sistema': return '⚙️';
            case 'vencimiento': return '⏰';
            default: return '📱';
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'reserva': return '#22C55E';
            case 'mantenimiento': return '#F59E0B';
            case 'disponibilidad': return '#10B981';
            case 'sistema': return '#6366F1';
            case 'vencimiento': return '#EF4444';
            default: return ParkampusTheme.colors.gray;
        }
    };

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notificaciones</Text>
                {noLeidas > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{noLeidas}</Text>
                    </View>
                )}
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.notificacionesContainer}>
                    {notificaciones.map((notificacion) => (
                        <TouchableOpacity
                            key={notificacion.id}
                            style={[
                                styles.notificacionCard,
                                !notificacion.leida && styles.notificacionNoLeida
                            ]}
                            activeOpacity={0.7}
                        >
                            <View style={styles.notificacionHeader}>
                                <View style={styles.tipoContainer}>
                                    <View style={[
                                        styles.tipoIcon,
                                        { backgroundColor: getTipoColor(notificacion.tipo) }
                                    ]}>
                                        <Text style={styles.iconText}>{getTipoIcon(notificacion.tipo)}</Text>
                                    </View>
                                    <View style={styles.notificacionContent}>
                                        <Text style={[
                                            styles.notificacionTitulo,
                                            !notificacion.leida && styles.tituloNoLeido
                                        ]}>
                                            {notificacion.titulo}
                                        </Text>
                                        <Text style={styles.notificacionMensaje}>
                                            {notificacion.mensaje}
                                        </Text>
                                    </View>
                                </View>
                                {!notificacion.leida && <View style={styles.puntito} />}
                            </View>
                            <Text style={styles.notificacionTiempo}>{notificacion.tiempo}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {notificaciones.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🔔</Text>
                        <Text style={styles.emptyTitle}>No hay notificaciones</Text>
                        <Text style={styles.emptyMessage}>
                            Te notificaremos cuando haya actualizaciones sobre tus reservas
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: ParkampusTheme.colors.main,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    badge: {
        backgroundColor: '#EF4444',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    notificacionesContainer: {
        padding: 16,
        paddingBottom: 80, // Espacio para el tab bar
    },
    notificacionCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    notificacionNoLeida: {
        borderLeftWidth: 4,
        borderLeftColor: ParkampusTheme.colors.main,
    },
    notificacionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    tipoContainer: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'flex-start',
    },
    tipoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconText: {
        fontSize: 18,
    },
    notificacionContent: {
        flex: 1,
    },
    notificacionTitulo: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    tituloNoLeido: {
        fontWeight: 'bold',
    },
    notificacionMensaje: {
        fontSize: 14,
        color: ParkampusTheme.colors.gray,
        lineHeight: 20,
    },
    puntito: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: ParkampusTheme.colors.main,
        marginTop: 4,
    },
    notificacionTiempo: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: 16,
        color: ParkampusTheme.colors.gray,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 22,
    },
});
