import { ParkampusTheme } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProgressBar } from '../ui/ProgressBar';

interface TypeAvailabilityCardProps {
    label: string;
    icon: IconSymbolName;
    available: number;
    total: number;
    color?: string;
}

export const TypeAvailabilityCard: React.FC<TypeAvailabilityCardProps> = ({
    label,
    icon,
    available,
    total,
    color = ParkampusTheme.colors.main
}) => {
    const occupied = total - available;
    const occupancyPercentage = total > 0 ? Math.round((occupied / total) * 100) : 0;
    const progress = total > 0 ? occupied / total : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                    <IconSymbol name={icon} size={24} color={color} />
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.label}>{label}</Text>
                    <Text style={styles.totalText}>Total: {total} espacios</Text>
                </View>
                <View style={styles.availableContainer}>
                    <Text style={[styles.availableCount, { color }]}>{available}</Text>
                    <Text style={styles.availableLabel}>disponibles</Text>
                </View>
            </View>

            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progress}
                    color={color}
                    backgroundColor={`${color}15`}
                    height={6}
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Ocupados: {occupied}</Text>
                <Text style={styles.footerText}>{occupancyPercentage}%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerText: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 2,
    },
    totalText: {
        fontSize: 12,
        color: ParkampusTheme.colors.textSecondary,
    },
    availableContainer: {
        alignItems: 'flex-end',
    },
    availableCount: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    availableLabel: {
        fontSize: 11,
        color: ParkampusTheme.colors.textSecondary,
    },
    progressContainer: {
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 12,
        color: ParkampusTheme.colors.textSecondary,
    },
});
