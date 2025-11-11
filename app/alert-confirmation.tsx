/**
 * Pantalla de confirmación de alerta masiva
 * Solo accesible para usuarios de tipo 'celador'
 */

import { ParkampusTheme } from '@/constants/theme';
import { sendMassAlert } from '@/services/alertService';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Opciones de alertas disponibles
const ALERT_OPTIONS = [
  {
    id: 'low_availability',
    label: 'Pocas celdas disponibles',
    message: 'Estimado usuario, le informamos que actualmente contamos con muy pocas celdas de parqueo disponibles. Le solicitamos amablemente revisar las opciones disponibles o considerar medios de transporte alternativos. Agradecemos su comprensión.',
  },
  {
    id: 'security',
    label: 'Motivos de seguridad',
    message: 'Por motivos de seguridad, le solicitamos de manera urgente desalojar las instalaciones de la universidad. Por favor, diríjase a la salida más cercana de forma ordenada y siga las instrucciones del personal de seguridad. Su colaboración es fundamental.',
  },
  {
    id: 'mandatory_evacuation',
    label: 'Obligatorio desalojar el campus',
    message: 'Aviso importante: Es obligatorio desalojar el campus universitario de manera inmediata. Le solicitamos dirigirse a las salidas de emergencia de forma ordenada y tranquila. Por favor, siga las indicaciones del personal y manténgase atento a nuevas comunicaciones. Gracias por su comprensión y colaboración.',
  },
  {
    id: 'night_closure',
    label: 'Cierre nocturno de la universidad',
    message: 'Estimado usuario, le recordamos que se aproxima el horario de cierre nocturno de la universidad. Le solicitamos amablemente desalojar las instalaciones y retirar su vehículo del campus antes del cierre. Agradecemos su puntualidad y colaboración.',
  },
];

export default function AlertConfirmationScreen() {
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedAlert) {
      Alert.alert('Error', 'Por favor selecciona un tipo de alerta');
      return;
    }

    const alertOption = ALERT_OPTIONS.find(option => option.id === selectedAlert);
    if (!alertOption) return;

    // Confirmar la acción
    Alert.alert(
      '¿Estás seguro?',
      `Se enviará una alerta masiva a todos los estudiantes y empleados: "${alertOption.label}"`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await sendMassAlert({
                alertType: selectedAlert,
                message: alertOption.message,
              });
              
              Alert.alert(
                'Alerta enviada',
                'La notificación ha sido enviada exitosamente a todos los usuarios.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'No se pudo enviar la alerta. Por favor intenta nuevamente.'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activar Alerta</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningTitle}>
            ¿Estás seguro que quieres enviar una alerta masiva?
          </Text>
          <Text style={styles.warningText}>
            Esta acción enviará una notificación push a todos los usuarios de tipo estudiante y empleado.
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Selecciona el motivo de la alerta:</Text>
          
          {ALERT_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.radioOption,
                selectedAlert === option.id && styles.radioOptionSelected,
              ]}
              onPress={() => setSelectedAlert(option.id)}
              activeOpacity={0.7}
            >
              <View style={styles.radioButton}>
                {selectedAlert === option.id && <View style={styles.radioButtonInner} />}
              </View>
              <View style={styles.radioContent}>
                <Text style={[
                  styles.radioLabel,
                  selectedAlert === option.id && styles.radioLabelSelected,
                ]}>
                  {option.label}
                </Text>
                {selectedAlert === option.id && (
                  <Text style={styles.radioMessage}>{option.message}</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            (!selectedAlert || loading) && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirm}
          disabled={!selectedAlert || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.confirmButtonText}>
              📢 Confirmar y enviar alerta
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: ParkampusTheme.colors.main,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  warningContainer: {
    backgroundColor: '#FEF3C7',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    alignItems: 'center',
  },
  warningIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  warningTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#78350F',
    textAlign: 'center',
    lineHeight: 20,
  },
  optionsContainer: {
    padding: 16,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ParkampusTheme.colors.black,
    marginBottom: 16,
  },
  radioOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  radioOptionSelected: {
    borderColor: ParkampusTheme.colors.main,
    backgroundColor: '#F0F9FF',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: ParkampusTheme.colors.main,
  },
  radioContent: {
    flex: 1,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: ParkampusTheme.colors.black,
    marginBottom: 4,
  },
  radioLabelSelected: {
    color: ParkampusTheme.colors.main,
  },
  radioMessage: {
    fontSize: 14,
    color: ParkampusTheme.colors.gray,
    lineHeight: 20,
    marginTop: 8,
    fontStyle: 'italic',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9CA3AF',
    elevation: 0,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomSpace: {
    height: 32,
  },
});
