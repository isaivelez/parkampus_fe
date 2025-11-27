import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { ParkampusTheme } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import api from '@/services/api';
import { API_ENDPOINTS } from '@/constants/api';

interface CreateNotificationModalProps {
    visible: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const NOTIFICATION_TYPES = [
    { label: 'Cierre nocturno', value: 'CIERRE_NOCTURNO', description: 'Recordatorio de cierre a las 10:00 PM.' },
    { label: 'Liberación de celdas en hora pico', value: 'LIBERACION_HORA_PICO', description: 'Solicitud para liberar espacios.' },
    { label: 'Cierre por temas de seguridad', value: 'CIERRE_SEGURIDAD', description: 'Evacuación preventiva.' },
    { label: 'Restricciones por evento', value: 'EVENTO_INSTITUCIONAL', description: 'Restricciones por evento masivo.' },
    { label: 'Mantenimiento de emergencia', value: 'MANTENIMIENTO_EMERGENCIA', description: 'Cierre parcial por obras.' },
];

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
    visible,
    onClose,
    onSuccess,
}) => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleTypeSelect = (type: typeof NOTIFICATION_TYPES[0]) => {
        setSelectedType(type.value);
        setDescription(type.description);
    };

    const handleSubmit = async () => {
        if (!selectedType) {
            Alert.alert('Error', 'Por favor selecciona un tipo de notificación.');
            return;
        }

        Alert.alert(
            'Confirmar',
            '¿Estás seguro de que deseas enviar esta notificación a todos los usuarios?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Enviar',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await api.post(API_ENDPOINTS.CREATE_NOTIFICATION, {
                                type: selectedType,
                            });
                            Alert.alert('Éxito', 'Notificación enviada correctamente');
                            onSuccess();
                            onClose();
                            // Reset form
                            setSelectedType(null);
                            setDescription('');
                        } catch (error) {
                            console.error('Error creating notification:', error);
                            Alert.alert('Error', 'No se pudo enviar la notificación. Intenta de nuevo.');
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Crear Notificación</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <IconSymbol name="xmark" size={24} color={ParkampusTheme.colors.gray} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.formContainer}>
                        <Text style={styles.label}>Tipo de Notificación</Text>
                        <View style={styles.typesContainer}>
                            {NOTIFICATION_TYPES.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.typeButton,
                                        selectedType === type.value && styles.typeButtonSelected,
                                    ]}
                                    onPress={() => handleTypeSelect(type)}
                                >
                                    <Text
                                        style={[
                                            styles.typeText,
                                            selectedType === type.value && styles.typeTextSelected,
                                        ]}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Descripción</Text>
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Descripción de la notificación..."
                            multiline
                            numberOfLines={3}
                        />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                            disabled={loading}
                        >
                            <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.submitButton, loading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>Enviar</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: ParkampusTheme.colors.black,
    },
    closeButton: {
        padding: 5,
    },
    formContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: ParkampusTheme.colors.black,
        marginBottom: 10,
        marginTop: 10,
    },
    typesContainer: {
        gap: 10,
    },
    typeButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
        backgroundColor: ParkampusTheme.colors.lightGray,
    },
    typeButtonSelected: {
        borderColor: ParkampusTheme.colors.main,
        backgroundColor: '#E3F2FD',
    },
    typeText: {
        fontSize: 14,
        color: ParkampusTheme.colors.textSecondary,
    },
    typeTextSelected: {
        color: ParkampusTheme.colors.main,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: ParkampusTheme.colors.cardBorder,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        minHeight: 80,
        textAlignVertical: 'top',
        backgroundColor: '#fff',
    },
    footer: {
        flexDirection: 'row',
        gap: 15,
        paddingTop: 10,
    },
    button: {
        flex: 1,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: ParkampusTheme.colors.lightGray,
    },
    submitButton: {
        backgroundColor: ParkampusTheme.colors.main,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    cancelButtonText: {
        color: ParkampusTheme.colors.black,
        fontWeight: '600',
        fontSize: 16,
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
