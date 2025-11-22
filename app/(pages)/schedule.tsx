import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ParkampusTheme } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { DAYS_OF_WEEK } from '@/types/schedule';
import { updateUser, ApiError } from '@/services/userService';
import { CalendarGrid } from '@/components/schedule/CalendarGrid';

interface DaySchedule {
    enabled: boolean;
    start_time: string;
    end_time: string;
}

export default function ScheduleScreen() {
    const { user, setUser, token } = useAuth();
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [expandedDay, setExpandedDay] = useState<string | null>(null);

    // Initialize schedule state
    const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(() => {
        const initial: Record<string, DaySchedule> = {};
        DAYS_OF_WEEK.forEach(day => {
            const existingDay = user?.schedule?.find(s => s.day === day);
            initial[day] = {
                enabled: !!existingDay,
                start_time: existingDay?.start_time || '06:00',
                end_time: existingDay?.end_time || '18:00',
            };
        });
        return initial;
    });

    // Auto-expand enabled days on mount
    useEffect(() => {
        const firstEnabledDay = DAYS_OF_WEEK.find(day => schedule[day].enabled);
        if (firstEnabledDay) {
            setExpandedDay(firstEnabledDay);
        }
    }, []);

    const toggleDay = (day: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled,
            },
        }));
        // Expand the day when enabling it
        if (!schedule[day].enabled) {
            setExpandedDay(day);
        }
    };

    const toggleAccordion = (day: string) => {
        setExpandedDay(expandedDay === day ? null : day);
    };

    const updateTime = (day: string, type: 'start_time' | 'end_time', value: string) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [type]: value,
            },
        }));
    };

    const handleSave = () => {
        // Validate that at least one day is enabled
        const hasEnabledDays = Object.values(schedule).some(day => day.enabled);

        if (!hasEnabledDays) {
            Alert.alert('Error', 'Debes habilitar al menos un día');
            return;
        }

        // Validate that enabled days have valid times
        for (const [day, config] of Object.entries(schedule)) {
            if (config.enabled) {
                const startHour = parseInt(config.start_time.split(':')[0]);
                const endHour = parseInt(config.end_time.split(':')[0]);

                if (startHour >= endHour) {
                    Alert.alert('Error', `La hora de salida debe ser mayor que la hora de entrada en ${day}`);
                    return;
                }
            }
        }

        // Show preview modal
        setShowPreview(true);
    };

    const confirmSave = async () => {
        if (!user || !token) return;

        // Convert schedule to array format
        const scheduleArray = Object.entries(schedule)
            .filter(([, config]) => config.enabled)
            .map(([day, config]) => ({
                day,
                start_time: config.start_time,
                end_time: config.end_time,
            }));

        try {
            setSaving(true);
            setShowPreview(false);
            const response = await updateUser(user._id, { schedule: scheduleArray });

            if (response.success && response.data) {
                // Update user in context
                setUser(response.data, token || undefined);
                Alert.alert(
                    '✅ Horario guardado',
                    'Tu horario ha sido actualizado correctamente',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back(),
                        },
                    ]
                );
            }
        } catch (error) {
            const apiError = error as ApiError;
            Alert.alert('Error', apiError.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <IconSymbol name="chevron.left" size={24} color={ParkampusTheme.colors.black} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Configurar Horario</Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <IconSymbol name="info.circle.fill" size={20} color={ParkampusTheme.colors.main} />
                        <Text style={styles.infoText}>
                            Selecciona los días que asistes a la universidad y configura tu horario.
                        </Text>
                    </View>

                    {/* Days List */}
                    {DAYS_OF_WEEK.map(day => (
                        <View key={day} style={styles.dayCard}>
                            {/* Day Header */}
                            <View style={styles.dayHeader}>
                                <TouchableOpacity
                                    style={styles.dayHeaderLeft}
                                    onPress={() => schedule[day].enabled && toggleAccordion(day)}
                                    activeOpacity={schedule[day].enabled ? 0.7 : 1}
                                >
                                    <Text
                                        style={[
                                            styles.dayName,
                                            schedule[day].enabled && styles.dayNameActive,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                    {schedule[day].enabled && (
                                        <Text style={styles.dayTime}>
                                            {schedule[day].start_time} - {schedule[day].end_time}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <Switch
                                    value={schedule[day].enabled}
                                    onValueChange={() => toggleDay(day)}
                                    trackColor={{
                                        false: '#D1D5DB',
                                        true: ParkampusTheme.colors.mainLight,
                                    }}
                                    thumbColor={
                                        schedule[day].enabled ? ParkampusTheme.colors.main : '#F3F4F6'
                                    }
                                />
                            </View>

                            {/* Accordion Content */}
                            {schedule[day].enabled && expandedDay === day && (
                                <View style={styles.timePickersContainer}>
                                    <View style={styles.timePickerRow}>
                                        <Text style={styles.timeLabel}>Hora de inicio</Text>
                                        <HourSelect
                                            value={schedule[day].start_time}
                                            onChange={value => updateTime(day, 'start_time', value)}
                                        />
                                    </View>
                                    <View style={styles.timePickerRow}>
                                        <Text style={styles.timeLabel}>Hora de salida</Text>
                                        <HourSelect
                                            value={schedule[day].end_time}
                                            onChange={value => updateTime(day, 'end_time', value)}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    ))}

                    {/* Save Button */}
                    <TouchableOpacity
                        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.saveButtonText}>Guardar Horario</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>

                {/* Preview Modal */}
                <Modal
                    visible={showPreview}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowPreview(false)}
                >
                    <View style={styles.previewModalOverlay}>
                        <View style={styles.previewModalContent}>
                            {/* Modal Header */}
                            <View style={styles.previewHeader}>
                                <Text style={styles.previewTitle}>Vista previa de tu horario</Text>
                                <TouchableOpacity onPress={() => setShowPreview(false)}>
                                    <IconSymbol name="xmark.circle.fill" size={28} color={ParkampusTheme.colors.gray} />
                                </TouchableOpacity>
                            </View>

                            {/* Preview Content */}
                            <ScrollView style={styles.previewScroll}>
                                <Text style={styles.previewSubtitle}>
                                    Así se verá tu horario configurado:
                                </Text>

                                <CalendarGrid
                                    schedule={Object.entries(schedule)
                                        .filter(([, config]) => config.enabled)
                                        .map(([day, config]) => ({
                                            day,
                                            start_time: config.start_time,
                                            end_time: config.end_time,
                                        }))}
                                />

                                {/* Schedule Summary */}
                                <View style={styles.previewSummary}>
                                    <Text style={styles.previewSummaryTitle}>Resumen:</Text>
                                    {Object.entries(schedule)
                                        .filter(([, config]) => config.enabled)
                                        .map(([day, config]) => (
                                            <View key={day} style={styles.previewSummaryItem}>
                                                <Text style={styles.previewDayName}>{day}</Text>
                                                <Text style={styles.previewDayTime}>
                                                    {config.start_time} - {config.end_time}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </ScrollView>

                            {/* Modal Actions */}
                            <View style={styles.previewActions}>
                                <TouchableOpacity
                                    style={styles.previewCancelButton}
                                    onPress={() => setShowPreview(false)}
                                >
                                    <Text style={styles.previewCancelText}>Editar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.previewConfirmButton}
                                    onPress={confirmSave}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.previewConfirmText}>Confirmar y Guardar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
}

// Hour Select Component
function HourSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const [showPicker, setShowPicker] = useState(false);

    // Generate hours from 6 AM to 10 PM
    const hours = [];
    for (let i = 6; i <= 22; i++) {
        hours.push({
            value: `${i.toString().padStart(2, '0')}:00`,
            label: i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`,
        });
    }

    const selectedHour = hours.find(h => h.value === value);

    return (
        <>
            <TouchableOpacity
                style={styles.timeInput}
                onPress={() => setShowPicker(true)}
            >
                <IconSymbol name="clock.fill" size={16} color={ParkampusTheme.colors.gray} />
                <Text style={styles.timeInputText}>
                    {selectedHour?.label || value}
                </Text>
                <IconSymbol name="chevron.down" size={16} color={ParkampusTheme.colors.gray} />
            </TouchableOpacity>

            <Modal
                visible={showPicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowPicker(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setShowPicker(false)}
                >
                    <View
                        style={styles.modalContent}
                        onStartShouldSetResponder={() => true}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Seleccionar hora</Text>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowPicker(false)}
                            >
                                <Text style={styles.modalCloseText}>Listo</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.modalOptions}>
                            {hours.map((hour) => (
                                <TouchableOpacity
                                    key={hour.value}
                                    style={[
                                        styles.modalOption,
                                        hour.value === value && styles.modalOptionSelected,
                                    ]}
                                    onPress={() => {
                                        onChange(hour.value);
                                        setShowPicker(false);
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>
                                        {hour.label}
                                    </Text>
                                    {hour.value === value && (
                                        <Text style={styles.modalOptionCheck}>✓</Text>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
        gap: 12,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1E40AF',
        lineHeight: 20,
    },
    dayCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
        overflow: 'hidden',
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    dayHeaderLeft: {
        flex: 1,
    },
    dayName: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 2,
    },
    dayNameActive: {
        color: ParkampusTheme.colors.black,
    },
    dayTime: {
        fontSize: 14,
        color: ParkampusTheme.colors.main,
        marginTop: 4,
    },
    timePickersContainer: {
        padding: 16,
        paddingTop: 0,
        gap: 16,
    },
    timePickerRow: {
        gap: 8,
    },
    timeLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 4,
    },
    timeInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: ParkampusTheme.colors.background,
        borderRadius: 8,
        padding: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
    },
    timeInputText: {
        fontSize: 16,
        color: ParkampusTheme.colors.black,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: ParkampusTheme.colors.main,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 24,
    },
    saveButtonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
    },
    modalCloseButton: {
        padding: 4,
    },
    modalCloseText: {
        fontSize: 16,
        color: ParkampusTheme.colors.main,
        fontWeight: '600',
    },
    modalOptions: {
        maxHeight: 300,
    },
    modalOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    modalOptionSelected: {
        backgroundColor: '#F3F4F6',
    },
    modalOptionText: {
        fontSize: 16,
        color: ParkampusTheme.colors.black,
    },
    modalOptionCheck: {
        fontSize: 20,
        color: ParkampusTheme.colors.main,
    },
    // Preview Modal Styles
    previewModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    previewModalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        maxHeight: '90%',
        overflow: 'hidden',
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    previewTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: ParkampusTheme.colors.black,
    },
    previewScroll: {
        padding: 20,
    },
    previewSubtitle: {
        fontSize: 15,
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 16,
        fontWeight: '500',
    },
    previewSummary: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        gap: 12,
    },
    previewSummaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    previewSummaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    previewDayName: {
        fontSize: 15,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
    },
    previewDayTime: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
    },
    previewActions: {
        flexDirection: 'row',
        padding: 20,
        paddingTop: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    previewCancelButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: ParkampusTheme.colors.main,
        alignItems: 'center',
    },
    previewCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.main,
    },
    previewConfirmButton: {
        flex: 2,
        padding: 16,
        borderRadius: 12,
        backgroundColor: ParkampusTheme.colors.main,
        alignItems: 'center',
    },
    previewConfirmText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
