import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { useEffect, useRef } from 'react';

interface NotificationBadgeProps {
  count: number;
  onPress?: () => void;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (count > 0) {
      // Animación de pulso cuando hay notificaciones nuevas
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [count]);

  if (count === 0) {
    return null;
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Animated.View style={[styles.badge, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
