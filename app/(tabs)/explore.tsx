import { StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts, ParkampusTheme } from '@/constants/theme';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: ParkampusTheme.colors.mainLight, dark: ParkampusTheme.colors.main }}
      headerImage={
        <IconSymbol
          size={310}
          color={ParkampusTheme.colors.white}
          name="car.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
            color: ParkampusTheme.colors.main,
          }}>
          Explorar Parkampus
        </ThemedText>
      </ThemedView>
      <ThemedText style={{ color: ParkampusTheme.colors.black }}>
        Descubre las funcionalidades de gestión de parqueaderos universitarios.
      </ThemedText>
      
      <Collapsible title="🚗 Gestión de Parqueaderos">
        <ThemedText>
          Parkampus permite gestionar los espacios de parqueo de la{' '}
          <ThemedText type="defaultSemiBold" style={{ color: ParkampusTheme.colors.main }}>
            Universidad Pascual Bravo - Sede Pilarica
          </ThemedText>
        </ThemedText>
        <ThemedText>
          Con funcionalidades como búsqueda en tiempo real, reservas y navegación por el campus.
        </ThemedText>
      </Collapsible>

      <Collapsible title="📱 Multiplataforma">
        <ThemedText>
          Esta aplicación funciona en{' '}
          <ThemedText type="defaultSemiBold" style={{ color: ParkampusTheme.colors.main }}>
            Android, iOS y web
          </ThemedText>. 
          Para abrir la versión web, presiona{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> en la terminal donde ejecutas el proyecto.
        </ThemedText>
      </Collapsible>

      <Collapsible title="🎨 Diseño Universitario">
        <ThemedText>
          Los colores de Parkampus reflejan la identidad visual universitaria:
        </ThemedText>
        <ThemedView style={styles.colorContainer}>
          <ThemedView style={[styles.colorSample, { backgroundColor: ParkampusTheme.colors.main }]}>
            <ThemedText style={styles.colorText}>Principal</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.colorSample, { backgroundColor: ParkampusTheme.colors.mainLight }]}>
            <ThemedText style={styles.colorText}>Claro</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.colorSample, { backgroundColor: ParkampusTheme.colors.black }]}>
            <ThemedText style={styles.colorText}>Negro</ThemedText>
          </ThemedView>
        </ThemedView>
      </Collapsible>

      <Collapsible title="🛠️ Tecnología">
        <ThemedText>
          Desarrollado con{' '}
          <ThemedText type="defaultSemiBold" style={{ color: ParkampusTheme.colors.main }}>
            React Native
          </ThemedText>{' '}
          y{' '}
          <ThemedText type="defaultSemiBold" style={{ color: ParkampusTheme.colors.main }}>
            Expo
          </ThemedText>
          , usando el enrutamiento basado en archivos para una experiencia fluida.
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link" style={{ color: ParkampusTheme.colors.mainLight }}>
            Aprende más sobre Expo Router
          </ThemedText>
        </ExternalLink>
      </Collapsible>

      <Collapsible title="🎓 Proyecto Académico">
        <ThemedText>
          Este proyecto es parte del curso de{' '}
          <ThemedText type="defaultSemiBold" style={{ color: ParkampusTheme.colors.main }}>
            Ingeniería de Software 2
          </ThemedText>{' '}
          de la Universidad Pascual Bravo.
        </ThemedText>
        <ThemedText>
          Enfocado en resolver problemas reales de movilidad en el campus universitario.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: ParkampusTheme.spacing.md,
    marginBottom: ParkampusTheme.spacing.md,
  },
  colorSample: {
    width: 80,
    height: 60,
    borderRadius: ParkampusTheme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: ParkampusTheme.spacing.xs,
  },
  colorText: {
    color: ParkampusTheme.colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
