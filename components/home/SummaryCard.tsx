import { ParkampusTheme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';

interface SummaryCardProps {
    available: number;
    total: number;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ available, total }) => {
    const occupancyPercentage = total > 0 ? Math.round(((total - available) / total) * 100) : 0;
    const progress = total > 0 ? (total - available) / total : 0;

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.label}>Cupos Disponibles</Text>
                <View style={styles.counterContainer}>
                    <Text style={styles.availableCount}>{available}</Text>
                    <Text style={styles.totalCount}> / {total}</Text>
                </View>

                <View style={styles.progressContainer}>
                    <ProgressBar
                        progress={progress}
                        color={ParkampusTheme.colors.success}
                        backgroundColor="rgba(255, 255, 255, 0.2)"
                        height={8}
                    />
                </View>

                <Text style={styles.occupancyText}>{occupancyPercentage}% de ocupación</Text>
            </View>

            {/* Decorative circle for visual interest */}
            <View style={styles.decorativeCircle} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: ParkampusTheme.colors.main,
        borderRadius: 16,
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
        shadowColor: '#004793',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
        marginBottom: 24,
    },
    content: {
        zIndex: 1,
    },
    label: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: 16,
    },
    availableCount: {
        color: 'white',
        fontSize: 48,
        fontWeight: 'bold',
    },
    totalCount: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 24,
        fontWeight: '500',
    },
    progressContainer: {
        marginBottom: 8,
    },
    occupancyText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
    },
    decorativeCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
});
