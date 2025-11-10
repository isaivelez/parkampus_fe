import { ParkampusTheme } from "@/constants/theme";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { IconSymbol } from "@/components/ui/icon-symbol";

export default function CeldasScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };
  // Datos de ejemplo para las celdas
  const celdas = [
    { id: 1, numero: "A-01", estado: "disponible", ubicacion: "Bloque A" },
    { id: 2, numero: "A-02", estado: "ocupado", ubicacion: "Bloque A" },
    { id: 3, numero: "A-03", estado: "disponible", ubicacion: "Bloque A" },
    { id: 4, numero: "B-01", estado: "mantenimiento", ubicacion: "Bloque B" },
    { id: 5, numero: "B-02", estado: "disponible", ubicacion: "Bloque B" },
    { id: 6, numero: "B-03", estado: "ocupado", ubicacion: "Bloque B" },
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "#22C55E";
      case "ocupado":
        return "#EF4444";
      case "mantenimiento":
        return "#F59E0B";
      default:
        return ParkampusTheme.colors.gray;
    }
  };

  const getEstadoText = (estado: string) => {
    switch (estado) {
      case "disponible":
        return "Disponible";
      case "ocupado":
        return "Ocupado";
      case "mantenimiento":
        return "Mantenimiento";
      default:
        return "Desconocido";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Bienvenido,</Text>
            <Text style={styles.userName}>
              {user ? `${user.first_name} ${user.last_name}` : "Usuario"}
            </Text>
            {user && (
              <Text style={styles.userRole}>
                {user.user_type === "estudiante"
                  ? "🎓 Estudiante"
                  : user.user_type === "empleado"
                  ? "💼 Empleado"
                  : "👮 Celador"}
              </Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <IconSymbol
              name="rectangle.portrait.and.arrow.right"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Celdas de Parqueo</Text>
        <Text style={styles.subtitle}>
          Universidad Pascual Bravo - Sede Pilarica
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#22C55E" }]}>3</Text>
            <Text style={styles.statLabel}>Disponibles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#EF4444" }]}>2</Text>
            <Text style={styles.statLabel}>Ocupadas</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#F59E0B" }]}>1</Text>
            <Text style={styles.statLabel}>Mantenimiento</Text>
          </View>
        </View>

        <View style={styles.celdasContainer}>
          {celdas.map((celda) => (
            <TouchableOpacity
              key={celda.id}
              style={[
                styles.celdaCard,
                { borderLeftColor: getEstadoColor(celda.estado) },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.celdaHeader}>
                <Text style={styles.celdaNumero}>{celda.numero}</Text>
                <View
                  style={[
                    styles.estadoBadge,
                    { backgroundColor: getEstadoColor(celda.estado) },
                  ]}
                >
                  <Text style={styles.estadoText}>
                    {getEstadoText(celda.estado)}
                  </Text>
                </View>
              </View>
              <Text style={styles.celdaUbicacion}>{celda.ubicacion}</Text>
              <Text style={styles.celdaInfo}>
                {celda.estado === "disponible"
                  ? "🟢 Toca para reservar"
                  : celda.estado === "ocupado"
                  ? "🔴 No disponible"
                  : "🟡 En mantenimiento"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    padding: 20,
    backgroundColor: ParkampusTheme.colors.main,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 10,
    borderRadius: 8,
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: ParkampusTheme.colors.main,
  },
  statLabel: {
    fontSize: 12,
    color: ParkampusTheme.colors.gray,
    marginTop: 4,
  },
  celdasContainer: {
    padding: 16,
    paddingBottom: 80, // Espacio para el tab bar
  },
  celdaCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  celdaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  celdaNumero: {
    fontSize: 18,
    fontWeight: "bold",
    color: ParkampusTheme.colors.black,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  celdaUbicacion: {
    fontSize: 14,
    color: ParkampusTheme.colors.gray,
    marginBottom: 4,
  },
  celdaInfo: {
    fontSize: 14,
    color: ParkampusTheme.colors.black,
    fontWeight: "500",
  },
});
