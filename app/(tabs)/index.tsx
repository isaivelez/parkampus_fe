import { StatCard } from '@/components/home/StatCard';
import { SummaryCard } from '@/components/home/SummaryCard';
import { TypeAvailabilityCard } from '@/components/home/TypeAvailabilityCard';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ParkampusTheme } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError, getParkingLots, ParkingLot, updateParkingLot } from '@/services/parkingService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



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


    // Case insensitive check for celador role
    const isCelador = user?.user_type?.toLowerCase() === 'celador';



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
    }, []);

    // Función para refrescar
    const onRefresh = () => {
        setRefreshing(true);
        fetchParkingLots();
    };

    // Calcular totales
    const totalCarAvailable = parkingLots.reduce((sum, lot) => sum + lot.car_available, 0);
    const totalMotoAvailable = parkingLots.reduce((sum, lot) => sum + lot.moto_available, 0);

    // Calcular capacidades máximas totales
    const totalCarCapacity = parkingLots.reduce((sum, lot) => sum + (lot.car_max_available || 0), 0);
    const totalMotoCapacity = parkingLots.reduce((sum, lot) => sum + (lot.moto_max_available || 0), 0);

    const totalAvailable = totalCarAvailable + totalMotoAvailable;
    const totalCapacity = totalCarCapacity + totalMotoCapacity;

    const totalOccupied = Math.max(0, totalCapacity - totalAvailable);

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

    // Componente de input numérico con flechas
    const NumberInput = ({
        value,
        onChange,
        max,
        disabled,
        error
    }: {
        value: string,
        onChange: (val: string) => void,
        max: number,
        disabled?: boolean,
        error?: boolean
    }) => {
        const handleIncrement = () => {
            const current = parseInt(value) || 0;
            if (current < max) {
                onChange((current + 1).toString());
            }
        };

        const handleDecrement = () => {
            const current = parseInt(value) || 0;
            if (current > 0) {
                onChange((current - 1).toString());
            }
        };

        return (
            <View style={[styles.numberInputContainer, error && styles.formInputError, disabled && styles.formInputDisabled]}>
                <TextInput
                    style={[styles.numberInput, disabled && { color: '#9CA3AF' }]}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    placeholder="0"
                    editable={!disabled}
                />
                <View style={styles.stepperContainer}>
                    <TouchableOpacity
                        style={[styles.stepperButton, styles.stepperButtonUp]}
                        onPress={handleIncrement}
                        disabled={disabled || (parseInt(value) || 0) >= max}
                    >
                        <IconSymbol name="chevron.right" size={12} color={disabled ? '#9CA3AF' : ParkampusTheme.colors.gray} style={{ transform: [{ rotate: '-90deg' }] }} />
                    </TouchableOpacity>
                    <View style={styles.stepperDivider} />
                    <TouchableOpacity
                        style={[styles.stepperButton, styles.stepperButtonDown]}
                        onPress={handleDecrement}
                        disabled={disabled || (parseInt(value) || 0) <= 0}
                    >
                        <IconSymbol name="chevron.right" size={12} color={disabled ? '#9CA3AF' : ParkampusTheme.colors.gray} style={{ transform: [{ rotate: '90deg' }] }} />
                    </TouchableOpacity>
                </View>
            </View>
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

        const getAvailabilityColor = (count: number) => {
            if (count < 10) return ParkampusTheme.colors.danger;
            if (count <= 20) return ParkampusTheme.colors.warning;
            return ParkampusTheme.colors.success;
        };

        return (
            <View style={styles.parkingLotCard}>
                <View style={styles.parkingLotHeader}>
                    <Text style={styles.parkingLotName}>{lot.name}</Text>
                    {isCelador && !isEditing && (
                        <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => setEditingLotId(lot._id)}
                        >
                            <Text style={styles.editButtonText}>✏️ Editar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isEditing ? (
                    // Modo edición
                    <View style={styles.editForm}>
                        <View style={styles.formRow}>
                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>
                                    🚗 Carros (Max: {lot.car_max_available})
                                </Text>
                                <Controller
                                    control={control}
                                    name="car_available"
                                    rules={{
                                        required: 'Requerido',
                                        validate: {
                                            isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
                                            isNotNegative: (value) => parseInt(value) >= 0 || 'No negativo',
                                            notExceedMax: (value) => parseInt(value) <= lot.car_max_available || `Máx ${lot.car_max_available}`,
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <NumberInput
                                            value={value}
                                            onChange={onChange}
                                            max={lot.car_max_available}
                                            disabled={lot.car_max_available === 0}
                                            error={!!errors.car_available}
                                        />
                                    )}
                                />
                                {errors.car_available && (
                                    <Text style={styles.errorTextSmall}>{errors.car_available.message}</Text>
                                )}
                            </View>

                            <View style={styles.formField}>
                                <Text style={styles.formLabel}>
                                    🏍️ Motos (Max: {lot.moto_max_available})
                                </Text>
                                <Controller
                                    control={control}
                                    name="moto_available"
                                    rules={{
                                        required: 'Requerido',
                                        validate: {
                                            isNumber: (value) => !isNaN(parseInt(value)) || 'Debe ser un número',
                                            isNotNegative: (value) => parseInt(value) >= 0 || 'No negativo',
                                            notExceedMax: (value) => parseInt(value) <= lot.moto_max_available || `Máx ${lot.moto_max_available}`,
                                        },
                                    }}
                                    render={({ field: { onChange, value } }) => (
                                        <NumberInput
                                            value={value}
                                            onChange={onChange}
                                            max={lot.moto_max_available}
                                            disabled={lot.moto_max_available === 0}
                                            error={!!errors.moto_available}
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
                            <View style={[styles.statIconContainer, { backgroundColor: '#E0F2FE' }]}>
                                <IconSymbol name="car.fill" size={20} color={ParkampusTheme.colors.main} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Carros</Text>
                                <Text style={[styles.statNumberLot, { color: getAvailabilityColor(lot.car_available) }]}>
                                    {lot.car_available} <Text style={styles.statMax}>/ {lot.car_max_available}</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={styles.parkingLotDivider} />
                        <View style={styles.parkingLotStat}>
                            <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
                                <IconSymbol name="bicycle" size={20} color={ParkampusTheme.colors.success} />
                            </View>
                            <View>
                                <Text style={styles.statLabel}>Motos</Text>
                                <Text style={[styles.statNumberLot, { color: getAvailabilityColor(lot.moto_available) }]}>
                                    {lot.moto_available} <Text style={styles.statMax}>/ {lot.moto_max_available}</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        );
    };

    const renderContent = () => (
        <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={ParkampusTheme.colors.main} />
            }
        >
            <View style={styles.contentContainer}>
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

                {/* Schedule Banner - Show only for students/employees without schedule */}
                {!isCelador && (!user?.schedule || user.schedule.length === 0) && (
                    <TouchableOpacity
                        style={styles.scheduleBanner}
                        onPress={() => router.push('/schedule')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.scheduleBannerIcon}>
                            <IconSymbol name="calendar" size={24} color={ParkampusTheme.colors.main} />
                        </View>
                        <View style={styles.scheduleBannerContent}>
                            <Text style={styles.scheduleBannerTitle}>Configura tu horario</Text>
                            <Text style={styles.scheduleBannerText}>
                                Define tu horario semanal para optimizar el uso del parqueadero
                            </Text>
                        </View>
                        <IconSymbol name="chevron.right" size={20} color={ParkampusTheme.colors.main} />
                    </TouchableOpacity>
                )}

                {/* Summary Card */}
                <SummaryCard available={totalAvailable} total={totalCapacity} />

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="Ocupados"
                        value={totalOccupied}
                        icon="checkmark.circle"
                        color={ParkampusTheme.colors.main}
                    />
                    <View style={{ width: 12 }} />
                    <StatCard
                        label="Capacidad Total"
                        value={totalCapacity}
                        icon="car.fill"
                        color={ParkampusTheme.colors.gray}
                    />
                </View>

                <Text style={styles.sectionTitle}>Disponibilidad por Tipo</Text>

                {/* Type Availability Cards */}
                <TypeAvailabilityCard
                    label="Automóviles"
                    icon="car.fill"
                    available={totalCarAvailable}
                    total={totalCarCapacity}
                    color={ParkampusTheme.colors.main}
                />

                <TypeAvailabilityCard
                    label="Motocicletas"
                    icon="bicycle"
                    available={totalMotoAvailable}
                    total={totalMotoCapacity}
                    color={ParkampusTheme.colors.success}
                />

                {/* Parking Lots List */}
                <Text style={styles.sectionTitle}>Detalle por Estacionamiento</Text>
                {parkingLots.map((lot) => (
                    <ParkingLotCard key={lot._id} lot={lot} />
                ))}
            </View>
        </ScrollView>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>P</Text>
                        </View>
                        <View>
                            <Text style={styles.appName}>Parkampus</Text>
                            <Text style={styles.appRole}>
                                {isCelador ? 'Panel de Celador' : 'Panel de Usuario'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <View style={styles.onlineBadge}>
                            <Text style={styles.onlineText}>En línea</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.logoutButton}
                            onPress={handleLogout}
                        >
                            <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={ParkampusTheme.colors.main} />
                        </TouchableOpacity>
                    </View>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={ParkampusTheme.colors.main} />
                        <Text style={styles.loadingText}>Cargando información...</Text>
                    </View>
                ) : (
                    renderContent()
                )}
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
    },
    logoContainer: {
        width: 40,
        height: 40,
        backgroundColor: ParkampusTheme.colors.main,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    appName: {
        color: ParkampusTheme.colors.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
    appRole: {
        color: ParkampusTheme.colors.gray,
        fontSize: 12,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    onlineBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    onlineText: {
        color: ParkampusTheme.colors.success,
        fontSize: 12,
        fontWeight: '500',
    },
    logoutButton: {
        padding: 4,
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
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
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
    statsRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 12,
        marginTop: 8,
    },
    // Parking Lot Card Styles
    parkingLotCard: {
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
    parkingLotHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    parkingLotName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
    editButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    editButtonText: {
        fontSize: 12,
        color: ParkampusTheme.colors.gray,
        fontWeight: '600',
    },
    parkingLotStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    parkingLotStat: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 20,
    },
    statLabel: {
        fontSize: 12,
        color: ParkampusTheme.colors.textSecondary,
    },
    statNumberLot: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statMax: {
        fontSize: 14,
        color: ParkampusTheme.colors.gray,
        fontWeight: 'normal',
    },
    parkingLotDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 16,
    },
    // Form Styles
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
        fontSize: 12,
        fontWeight: '600',
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 6,
    },
    formInput: {
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        backgroundColor: '#F9FAFB',
    },
    formInputError: {
        borderColor: ParkampusTheme.colors.danger,
        backgroundColor: '#FEF2F2',
    },
    formInputDisabled: {
        backgroundColor: '#E5E7EB',
        color: '#9CA3AF',
    },
    errorTextSmall: {
        fontSize: 10,
        color: ParkampusTheme.colors.danger,
        marginTop: 4,
    },
    formButtons: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    cancelButtonText: {
        color: ParkampusTheme.colors.gray,
        fontWeight: '600',
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: ParkampusTheme.colors.main,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
    },
    saveButtonDisabled: {
        opacity: 0.7,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    numberInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
        borderRadius: 8,
        backgroundColor: ParkampusTheme.colors.lightGray,
        height: 44,
        overflow: 'hidden',
    },
    numberInput: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 16,
        color: ParkampusTheme.colors.black,
    },
    stepperContainer: {
        width: 32,
        borderLeftWidth: 1,
        borderLeftColor: ParkampusTheme.colors.cardBorder,
        backgroundColor: 'white',
    },
    stepperButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    stepperButtonUp: {
        borderBottomWidth: 0,
    },
    stepperButtonDown: {
        borderTopWidth: 0,
    },
    stepperDivider: {
        height: 1,
        backgroundColor: ParkampusTheme.colors.cardBorder,
    },
    scheduleBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FFEDD5',
        gap: 12,
    },
    scheduleBannerIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduleBannerContent: {
        flex: 1,
    },
    scheduleBannerTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    scheduleBannerText: {
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
});
