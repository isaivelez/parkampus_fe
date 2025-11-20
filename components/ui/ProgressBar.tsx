import { ParkampusTheme } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressBarProps {
    progress: number; // 0 to 1
    color?: string;
    height?: number;
    backgroundColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    color = ParkampusTheme.colors.success,
    height = 8,
    backgroundColor = '#E5E7EB',
}) => {
    // Ensure progress is between 0 and 1
    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    return (
        <View style={[styles.container, { height, backgroundColor }]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${clampedProgress * 100}%`,
                        backgroundColor: color,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 4,
    },
});
