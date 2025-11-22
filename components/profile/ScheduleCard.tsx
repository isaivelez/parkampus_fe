import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ParkampusTheme } from '@/constants/theme';
import { User } from '@/services/userService';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface ScheduleCardProps {
    user: User;
}

const DAY_LABELS: Record<string, string> = {
    'Lunes': 'LUN',
    'Martes': 'MAR',
    'Miércoles': 'MIÉ',
    'Jueves': 'JUE',
    'Viernes': 'VIE',
    'Sábado': 'SÁB',
};

export function ScheduleCard({ user }: ScheduleCardProps) {
    const hasSchedule = user.schedule && user.schedule.length > 0;

    if (!hasSchedule) {
        return (
            <View style={styles.emptyContainer}>
                <View style={styles.emptyIconContainer}>
                    <IconSymbol name="calendar" size={40} color={ParkampusTheme.colors.main} />
                </View>
                <Text style={styles.emptyTitle}>Sin horario configurado</Text>
                <Text style={styles.emptyMessage}>
                    Configura tu horario semanal para que podamos optimizar tu experiencia en el parqueadero
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.scheduleContainer}>
            {/* Header */}
            <View style={styles.scheduleHeader}>
                <IconSymbol name="calendar.badge.clock" size={20} color={ParkampusTheme.colors.main} />
                <Text style={styles.scheduleHeaderText}>Horario configurado</Text>
            </View>

            {/* Days Grid */}
            <View style={styles.daysGrid}>
                {user.schedule.map((day, index) => (
                    <View key={index} style={styles.dayCard}>
                        <View style={styles.dayCardHeader}>
                            <Text style={styles.dayLabel}>{DAY_LABELS[day.day] || day.day.substring(0, 3).toUpperCase()}</Text>
                        </View>
                        <View style={styles.dayCardBody}>
                            <View style={styles.timeRow}>
                                <IconSymbol name="arrow.right.circle.fill" size={14} color="#10B981" />
                                <Text style={styles.timeText}>{day.start_time}</Text>
                            </View>
                            <View style={styles.timeDivider} />
                            <View style={styles.timeRow}>
                                <IconSymbol name="arrow.left.circle.fill" size={14} color="#EF4444" />
                                <Text style={styles.timeText}>{day.end_time}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.summary}>
                <IconSymbol name="checkmark.circle.fill" size={16} color={ParkampusTheme.colors.main} />
                <Text style={styles.summaryText}>
                    {user.schedule.length} {user.schedule.length === 1 ? 'día configurado' : 'días configurados'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        alignItems: 'center',
        padding: 32,
        gap: 12,
    },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    emptyTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 4,
    },
    emptyMessage: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        maxWidth: '90%',
    },
    scheduleContainer: {
        gap: 16,
    },
    scheduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    scheduleHeaderText: {
        fontSize: 15,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
    },
    daysGrid: {
        gap: 12,
    },
    dayCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    dayCardHeader: {
        backgroundColor: ParkampusTheme.colors.main,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dayLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: 'white',
        letterSpacing: 0.5,
    },
    dayCardBody: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 12,
    },
    timeRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    timeText: {
        fontSize: 14,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
    },
    timeDivider: {
        width: 1,
        height: 20,
        backgroundColor: '#D1D5DB',
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    summaryText: {
        fontSize: 13,
        color: ParkampusTheme.colors.textSecondary,
        fontWeight: '500',
    },
});
