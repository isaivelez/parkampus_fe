import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ParkampusTheme } from '@/constants/theme';

interface ScheduleDay {
    day: string;
    start_time: string;
    end_time: string;
}

interface CalendarGridProps {
    schedule: ScheduleDay[];
}

const DAY_LABELS: Record<string, string> = {
    'Lunes': 'LUN',
    'Martes': 'MAR',
    'Miércoles': 'MIÉ',
    'Jueves': 'JUE',
    'Viernes': 'VIE',
    'Sábado': 'SÁB',
};

const DAY_COLORS: Record<string, string> = {
    'Lunes': '#DBEAFE',     // Light blue
    'Martes': '#FCE7F3',    // Light pink
    'Miércoles': '#FEF3C7', // Light yellow
    'Jueves': '#D1FAE5',    // Light green
    'Viernes': '#E0E7FF',   // Light purple
    'Sábado': '#FED7AA',    // Light orange
};

export function CalendarGrid({ schedule }: CalendarGridProps) {
    // Prepare schedule data for calendar grid
    const scheduleMap = new Map();
    schedule.forEach(day => {
        const startHour = parseInt(day.start_time.split(':')[0]);
        const endHour = parseInt(day.end_time.split(':')[0]);
        scheduleMap.set(day.day, { start: startHour, end: endHour });
    });

    // All possible days
    const allDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    // Hours range (6 AM to 10 PM)
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 to 22

    const formatHour = (hour: number) => {
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return '12 PM';
        return `${hour - 12} PM`;
    };

    const isTimeScheduled = (day: string, hour: number) => {
        const schedule = scheduleMap.get(day);
        if (!schedule) return false;
        return hour >= schedule.start && hour < schedule.end;
    };

    return (
        <View style={styles.calendarGrid}>
            {/* Days Header */}
            <View style={styles.calendarHeader}>
                <View style={styles.timeColumnHeader} />
                {allDays.map((day) => (
                    <View key={day} style={styles.dayColumn}>
                        <Text style={styles.dayHeaderText}>
                            {DAY_LABELS[day] || day.substring(0, 3).toUpperCase()}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Time Grid */}
            <View style={styles.gridBody}>
                {hours.map((hour) => (
                    <View key={hour} style={styles.gridRow}>
                        <View style={styles.timeLabel}>
                            <Text style={styles.timeLabelText}>{formatHour(hour)}</Text>
                        </View>
                        {allDays.map((day) => {
                            const isScheduled = isTimeScheduled(day, hour);
                            return (
                                <View
                                    key={`${day}-${hour}`}
                                    style={[
                                        styles.gridCell,
                                        isScheduled && {
                                            backgroundColor: DAY_COLORS[day] || ParkampusTheme.colors.mainLight,
                                        },
                                    ]}
                                />
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    calendarGrid: {
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    calendarHeader: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    timeColumnHeader: {
        width: 60,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
    },
    dayColumn: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayHeaderText: {
        fontSize: 11,
        fontWeight: '700',
        color: ParkampusTheme.colors.main,
        letterSpacing: 0.5,
    },
    gridBody: {
        maxHeight: 300,
    },
    gridRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    timeLabel: {
        width: 60,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderRightWidth: 1,
        borderRightColor: '#E5E7EB',
        justifyContent: 'center',
    },
    timeLabelText: {
        fontSize: 9,
        color: ParkampusTheme.colors.textSecondary,
        fontWeight: '500',
    },
    gridCell: {
        flex: 1,
        height: 24,
        backgroundColor: 'transparent',
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
});
