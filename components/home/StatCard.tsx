import { ParkampusTheme } from '@/constants/theme';
import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
    label: string;
    value: number | string;
    icon: IconSymbolName;
    color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    label,
    value,
    icon,
    color = ParkampusTheme.colors.main
}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
                <IconSymbol name={icon} size={24} color={color} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
        marginBottom: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
});
