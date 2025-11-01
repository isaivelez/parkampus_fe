import { ParkampusTheme } from '@/constants/theme';
import { Platform, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Bienvenido a Parkampus!</Text>
        <Text style={styles.subtitle}>Sistema de Gestión de Parqueaderos</Text>
        <Text style={styles.description}>
          Universidad Pascual Bravo - Sede Pilarica{'\n'}
          Ejecutándose en {Platform.OS}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>� Encuentra tu espacio ideal</Text>
        </View>
        <View style={styles.featureContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔍</Text>
            <Text style={styles.featureText}>Buscar parqueaderos</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📅</Text>
            <Text style={styles.featureText}>Reservar espacios</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🗺️</Text>
            <Text style={styles.featureText}>Navegar campus</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ParkampusTheme.colors.lightGray,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ParkampusTheme.spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: ParkampusTheme.colors.main,
    marginBottom: ParkampusTheme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: ParkampusTheme.colors.black,
    marginBottom: ParkampusTheme.spacing.lg,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: ParkampusTheme.colors.gray,
    textAlign: 'center',
    marginBottom: ParkampusTheme.spacing.xl,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: ParkampusTheme.colors.mainLight,
    paddingHorizontal: ParkampusTheme.spacing.lg,
    paddingVertical: ParkampusTheme.spacing.md,
    borderRadius: ParkampusTheme.borderRadius.xl,
    marginBottom: ParkampusTheme.spacing.xl,
  },
  badgeText: {
    color: ParkampusTheme.colors.white,
    fontSize: 16,
    fontWeight: '500',
  },
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: ParkampusTheme.spacing.lg,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: ParkampusTheme.spacing.sm,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: ParkampusTheme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: ParkampusTheme.colors.black,
    textAlign: 'center',
    fontWeight: '500',
  },
});
