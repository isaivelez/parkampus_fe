import { StyleSheet, View, Text, Platform } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Hola Mundo!</Text>
        <Text style={styles.subtitle}>Bienvenido a Parkampus FE</Text>
        <Text style={styles.description}>
          Esta es tu aplicación React Native con Expo funcionando en {Platform.OS}
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🚀 Proyecto iniciado exitosamente</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  badge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
