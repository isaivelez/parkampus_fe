import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, getParkingLots, ParkingLot, updateParkingLot } from '@/services/parkingService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Configurar el comportamiento de las notificaciones
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// Tipo para el formulario de edición
type ParkingLotFormData = {
    car_available: string;
    moto_available: string;
};

export default function CeldasScreen() {
    const { user, logout } = useAuth();
    const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [editingLotId, setEditingLotId] = useState<string | null>(null);
    const [notificationPermissionAsked, setNotificationPermissionAsked] = useState(false);

    const isCelador = user?.user_type === 'celador';

    // Función para solicitar permisos de notificaciones
    const requestNotificationPermissions = async () => {
        try {
            // Verificar si ya se pidieron permisos antes
            const hasAsked = await AsyncStorage.getItem('notificationPermissionAsked');
            if (hasAsked === 'true') {
                setNotificationPermissionAsked(true);
                return;
            }

            // Obtener el estado actual de los permisos
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Si no se han otorgado permisos, pedirlos
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            // Guardar que ya se pidieron permisos
            await AsyncStorage.setItem('notificationPermissionAsked', 'true');
            setNotificationPermissionAsked(true);

            if (finalStatus === 'granted') {
                Alert.alert(
                    '🔔 Notificaciones activadas',
                    'Recibirás notificaciones sobre la disponibilidad del parqueadero',
                    [{ text: 'Entendido' }]
                );
            } else {
                Alert.alert(
                    '⚠️ Notificaciones desactivadas',
                    'Puedes activarlas más tarde desde la configuración de tu dispositivo',
                    [{ text: 'Entendido' }]
                );
            }
        } catch (error) {
            console.error('Error al solicitar permisos de notificaciones:', error);
        }
    };

    // Función para obtener los parking lots
    const fetchParkingLots = async () => {
        try {
            const response = await getParkingLots();
            if (response.success) {
                setParkingLots(response.data);
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        fetchParkingLots();

        // Solicitar permisos de notificaciones después de un breve delay
        const timer = setTimeout(() => {
            if (!notificationPermissionAsked) {
                requestNotificationPermissions();
            }
        }, 2000); // 2 segundos después de cargar

        return () => clearTimeout(timer);
    }, []);

    // Función para refrescar
    const onRefresh = () => {
        setRefreshing(true);
        fetchParkingLots();
    };

    // Calcular totales
    const totalCarAvailable = parkingLots.reduce((sum, lot) => sum + lot.car_available, 0);
    const totalMotoAvailable = parkingLots.reduce((sum, lot) => sum + lot.moto_available, 0);

    // Función para obtener el color según la disponibilidad
    const getAvailabilityColor = (count: number): string => {
        if (count < 10) return '#EF4444'; // Rojo
        if (count <= 20) return '#F59E0B'; // Naranja
        return '#22C55E'; // Verde
    };

    const handleLogout = () => {
        Alert.alert(
            "Cerrar sesión",
            "¿Estás seguro de que deseas cerrar sesión?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Cerrar sesión",
                    style: "destructive",
                    onPress: async () => {
                        await logout();
                        router.replace("/login");
                    }
                }
            ]
        );
    };

    // Componente para cada card de parking lot con edición inline
    const ParkingLotCard = ({ lot }: { lot: ParkingLot }) => {
        const isEditing = editingLotId === lot._id;
        const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ParkingLotFormData>({
            defaultValues: {
                car_available: lot.car_available.toString(),
                moto_available: lot.moto_available.toString(),
            },
        });

        const onSubmit = async (data: ParkingLotFormData) => {
            try {
                const carValue = parseInt(data.car_available, 10);
                const motoValue = parseInt(data.moto_available, 10);

                const response = await updateParkingLot(lot._id, {
                    car_available: carValue,
                    moto_available: motoValue,
                });

                if (response.success) {
                    // Actualizar la lista local
                    await fetchParkingLots();
                    setEditingLotId(null);
                    Alert.alert('✅ Éxito', 'Valores actualizados correctamente');
                }
            } catch (error) {
                const apiError = error as ApiError;
                Alert.alert('❌ Error', apiError.message);
            }
        };

        const handleCancel = () => {
            reset({
                car_available: lot.car_available.toString(),
                moto_available: lot.moto_available.toString(),
            });
            setEditingLotId(null);
        };

        return (
            <View style={styles.parkingLotCard}>
                <View style={styles.parkingLotHeader}>
                    <Text style={styles.parkingLotName}>{lot.name}</Text>
                    {!isEditing && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditingLotId(lot._id)}
                        >
                            <Text style={styles.editButtonText}>✏️ Actualizar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isEditing ? (
                    // Modo edición
                    <View style={styles.editForm}>
                        <View style={styles.formRow}>
                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>🚗 Carros</Text>
                                <Controller
                                    control={control}
                                    name="car_available"
                                    rules={{
                                        required: 'Campo requerido',
                                        validate: {
                                            isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
                                            isNotNegative: (value) => parseInt(value) >= 0 || 'No puede ser negativo',
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[styles.formInput, errors.car_available && styles.formInputError]}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="number-pad"
                                            placeholder="0"
                                        />
                                    )}
                                />
                                {errors.car_available && (
                                    <Text style={styles.errorTextSmall}>{errors.car_available.message}</Text>
                                )}
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>🏍️ Motos</Text>
                                <Controller
                                    control={control}
                                    name="moto_available"
                                    rules={{
                                        required: 'Campo requerido',
                                        validate: {
                                            isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
                                            isNotNegative: (value) => parseInt(value) >= 0 || 'No puede ser negativo',
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={[styles.formInput, errors.moto_available && styles.formInputError]}
                                            value={value}
                                            onChangeText={onChange}
                                            keyboardType="number-pad"
                                            placeholder="0"
                                        />
                                    )}
                                />
                                {errors.moto_available && (
                                    <Text style={styles.errorTextSmall}>{errors.moto_available.message}</Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.formButtons}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleCancel}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
                                onPress={handleSubmit(onSubmit)}
                                disabled={isSubmitting}
                            >
                                <Text style={styles.saveButtonText}>
                                    {isSubmitting ? 'Guardando...' : '💾 Guardar'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // Modo lectura
                    <View style={styles.parkingLotStats}>
                        <View style={styles.parkingLotStat}>
                            <Text style={styles.statIcon}>🚗</Text>
                            <Text
                                style={[
                                    styles.statNumberLot,
                                    { color: getAvailabilityColor(lot.car_available) }
                                ]}
                            >
                                {lot.car_available}
                            </Text>
                        </View>
                        <View style={styles.parkingLotStat}>
                            <Text style={styles.statIcon}>🏍️</Text>
                            <Text
                                style={[
                                    styles.statNumberLot,
                                    { color: getAvailabilityColor(lot.moto_available) }
                                ]}
                            >
                                {lot.moto_available}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    // Renderizar vista de celador
    const renderCeladorView = () => (
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.celadorContainer}>
                <Text style={styles.celadorTitle}>Disponibilidad Total</Text>
                <Text style={styles.celadorSubtitle}>Todos los estacionamientos</Text>

                {/* Cards de disponibilidad */}
                <View style={styles.availabilityCards}>
                    {/* Card para Carros */}
                    <View style={styles.availabilityCard}>
                        <View style={styles.cardIcon}>
                            <Text style={styles.cardIconText}>🚗</Text>
                        </View>
                        <Text style={styles.cardLabel}>Para Carro</Text>
                        <Text
                            style={[
                                styles.cardCounter,
                                { color: getAvailabilityColor(totalCarAvailable) }
                            ]}
                        >
                            {totalCarAvailable}
                        </Text>
                        <Text style={styles.cardSubtext}>espacios disponibles</Text>
                    </View>

                    {/* Card para Motos */}
                    <View style={styles.availabilityCard}>
                        <View style={styles.cardIcon}>
                            <Text style={styles.cardIconText}>🏍️</Text>
                        </View>
                        <Text style={styles.cardLabel}>Para Moto</Text>
                        <Text
                            style={[
                                styles.cardCounter,
                                { color: getAvailabilityColor(totalMotoAvailable) }
                            ]}
                        >
                            {totalMotoAvailable}
                        </Text>
                        <Text style={styles.cardSubtext}>espacios disponibles</Text>
                    </View>
                </View>

                {/* Leyenda de colores */}
                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Indicadores:</Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.legendText}>Menos de 10</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.legendText}>10 - 20</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                            <Text style={styles.legendText}>Más de 20</Text>
                        </View>
                    </View>
                </View>

                {/* Lista de estacionamientos */}
                <Text style={styles.parkingLotsTitle}>Detalle por estacionamiento</Text>
                {parkingLots.map((lot) => (
                    <ParkingLotCard key={lot._id} lot={lot} />
                ))}
            </View>
        </ScrollView>
    );

    // Renderizar vista de estudiante/empleado
    const renderDefaultView = () => (
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.celadorContainer}>
                <Text style={styles.celadorTitle}>Disponibilidad de Parqueadero</Text>
                <Text style={styles.celadorSubtitle}>Estado actual</Text>

                {/* Cards de disponibilidad */}
                <View style={styles.availabilityCards}>
                    {/* Card para Carros */}
                    <View style={styles.availabilityCard}>
                        <View style={styles.cardIcon}>
                            <Text style={styles.cardIconText}>🚗</Text>
                        </View>
                        <Text style={styles.cardLabel}>Para Carro</Text>
                        <Text
                            style={[
                                styles.cardCounter,
                                { color: getAvailabilityColor(totalCarAvailable) }
                            ]}
                        >
                            {totalCarAvailable}
                        </Text>
                        <Text style={styles.cardSubtext}>espacios disponibles</Text>
                    </View>

                    {/* Card para Motos */}
                    <View style={styles.availabilityCard}>
                        <View style={styles.cardIcon}>
                            <Text style={styles.cardIconText}>🏍️</Text>
                        </View>
                        <Text style={styles.cardLabel}>Para Moto</Text>
                        <Text
                            style={[
                                styles.cardCounter,
                                { color: getAvailabilityColor(totalMotoAvailable) }
                            ]}
                        >
                            {totalMotoAvailable}
                        </Text>
                        <Text style={styles.cardSubtext}>espacios disponibles</Text>
                    </View>
                </View>

                {/* Leyenda de colores */}
                <View style={styles.legendContainer}>
                    <Text style={styles.legendTitle}>Indicadores:</Text>
                    <View style={styles.legendItems}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.legendText}>Menos de 10</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.legendText}>10 - 20</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendDot, { backgroundColor: '#22C55E' }]} />
                            <Text style={styles.legendText}>Más de 20</Text>
                        </View>
                    </View>
                </View>

                {/* Lista de estacionamientos (solo lectura para estudiantes/empleados) */}
                <Text style={styles.parkingLotsTitle}>Detalle por estacionamiento</Text>
                {parkingLots.map((lot) => (
                    <View key={lot._id} style={styles.parkingLotCard}>
                        <View style={styles.parkingLotHeader}>
                            <Text style={styles.parkingLotName}>{lot.name}</Text>
                        </View>
                        <View style={styles.parkingLotStats}>
                            <View style={styles.parkingLotStat}>
                                <Text style={styles.statIcon}>🚗</Text>
                                <Text
                                    style={[
                                        styles.statNumberLot,
                                        { color: getAvailabilityColor(lot.car_available) }
                                    ]}
                                >
                                    {lot.car_available}
                                </Text>
                            </View>
                            <View style={styles.parkingLotStat}>
                                <Text style={styles.statIcon}>🏍️</Text>
                                <Text
                                    style={[
                                        styles.statNumberLot,
                                        { color: getAvailabilityColor(lot.moto_available) }
                                    ]}
                                >
                                    {lot.moto_available}
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.userInfo}>
                        <Text style={styles.welcomeText}>Bienvenido,</Text>
                        <Text style={styles.userName}>
                            {user ? `${user.first_name} ${user.last_name}` : 'Usuario'}
                        </Text>
                        {user && (
                            <Text style={styles.userRole}>
                                {user.user_type === 'estudiante' ? '🎓 Estudiante' :
                                    user.user_type === 'empleado' ? '💼 Empleado' :
                                        '👮 Celador'}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <IconSymbol name="rectangle.portrait.and.arrow.right" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.title}>
                    {isCelador ? 'Panel de Control' : 'Celdas de Parqueo'}
                </Text>
                <Text style={styles.subtitle}>Universidad Pascual Bravo - Sede Pilarica</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={ParkampusTheme.colors.main} />
                    <Text style={styles.loadingText}>Cargando información...</Text>
                </View>
            ) : (
                isCelador ? renderCeladorView() : renderDefaultView()
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 20,
        backgroundColor: ParkampusTheme.colors.main,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    userInfo: {
        flex: 1,
    },
    welcomeText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 4,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    userRole: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 10,
        borderRadius: 8,
        marginLeft: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: ParkampusTheme.colors.gray,
    },
    scrollView: {
        flex: 1,
    },
    // Estilos para vista de celador
    celadorContainer: {
        padding: 16,
        paddingBottom: 80,
    },
    celadorTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    celadorSubtitle: {
        fontSize: 16,
        color: ParkampusTheme.colors.gray,
        marginBottom: 20,
    },
    availabilityCards: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 12,
    },
    availabilityCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardIconText: {
        fontSize: 32,
    },
    cardLabel: {
        fontSize: 14,
        color: ParkampusTheme.colors.gray,
        marginBottom: 8,
        fontWeight: '600',
    },
    cardCounter: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    cardSubtext: {
        fontSize: 12,
        color: ParkampusTheme.colors.gray,
        textAlign: 'center',
    },
    legendContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 12,
    },
    legendItems: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 6,
    },
    legendText: {
        fontSize: 13,
        color: ParkampusTheme.colors.gray,
    },
    parkingLotsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
        marginBottom: 12,
    },
    parkingLotCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    parkingLotName: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 12,
    },
    parkingLotStats: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    parkingLotStat: {
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    statNumberLot: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    // Estilos para el formulario de edición
    parkingLotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    editButton: {
        backgroundColor: ParkampusTheme.colors.gray,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    editButtonText: {
        fontSize: 12,
        color: 'white',
        fontWeight: '600',
    },
    editForm: {
        marginTop: 8,
    },
    formRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    formField: {
        flex: 1,
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 8,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#F9FAFB',
    },
    formInputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    errorTextSmall: {
        fontSize: 11,
        color: '#EF4444',
        marginTop: 4,
    },
    formButtons: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#E5E7EB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    cancelButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
    },
    saveButton: {
        backgroundColor: ParkampusTheme.colors.main,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: 'white',
    },
});
