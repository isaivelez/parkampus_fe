import React, { useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ParkampusTheme } from "@/constants/theme";

export interface SelectOption {
    label: string;
    value: string;
    emoji?: string;
}

interface SelectProps {
    label: string;
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
}

export function Select({
    label,
    value,
    options,
    onChange,
    error,
    placeholder = "Selecciona una opción",
}: SelectProps) {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const [showPicker, setShowPicker] = useState(false);

    const styles = StyleSheet.create({
        container: {
            marginBottom: 16,
        },
        label: {
            fontSize: 14,
            fontWeight: "600",
            color: isDark ? "#F3F4F6" : "#374151",
            marginBottom: 8,
        },
        // iOS Custom Picker
        customPickerButton: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            borderRadius: 8,
            backgroundColor: isDark ? "#111827" : "#F9FAFB",
            paddingHorizontal: 12,
            height: 48,
        },
        customPickerButtonError: {
            borderColor: "#DC2626",
            backgroundColor: isDark ? "#1F1416" : "#FEF2F2",
        },
        customPickerButtonContent: {
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
        },
        customPickerEmoji: {
            fontSize: 20,
            marginRight: 8,
        },
        customPickerText: {
            fontSize: 15,
            color: isDark ? "#FFFFFF" : "#111827",
        },
        customPickerPlaceholder: {
            fontSize: 15,
            color: isDark ? "#6B7280" : "#9CA3AF",
        },
        customPickerArrow: {
            fontSize: 16,
            color: isDark ? "#9CA3AF" : "#6B7280",
        },
        // Android Picker
        pickerContainer: {
            borderWidth: 1,
            borderColor: isDark ? "#374151" : "#D1D5DB",
            borderRadius: 8,
            backgroundColor: isDark ? "#111827" : "#F9FAFB",
            overflow: "hidden",
        },
        pickerContainerError: {
            borderColor: "#DC2626",
            backgroundColor: isDark ? "#1F1416" : "#FEF2F2",
        },
        picker: {
            height: 48,
            color: isDark ? "#FFFFFF" : "#111827",
        },
        errorText: {
            fontSize: 13,
            color: "#DC2626",
            marginTop: 4,
        },
        // Modal
        modalOverlay: {
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
        },
        modalContent: {
            backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: Platform.OS === "ios" ? 34 : 20,
        },
        modalHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: isDark ? "#FFFFFF" : "#1F2937",
        },
        modalCloseButton: {
            padding: 4,
        },
        modalCloseText: {
            fontSize: 16,
            color: ParkampusTheme.colors.main,
            fontWeight: "600",
        },
        modalOptions: {
            maxHeight: 300,
        },
        modalOption: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? "#374151" : "#E5E7EB",
        },
        modalOptionSelected: {
            backgroundColor: isDark ? "#374151" : "#F3F4F6",
        },
        modalOptionEmoji: {
            fontSize: 24,
            marginRight: 12,
        },
        modalOptionText: {
            fontSize: 16,
            color: isDark ? "#FFFFFF" : "#1F2937",
            flex: 1,
        },
        modalOptionCheck: {
            fontSize: 20,
            color: ParkampusTheme.colors.main,
        },
    });

    const selectedOption = options.find((o) => o.value === value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            {Platform.OS === "ios" ? (
                <>
                    <TouchableOpacity
                        style={[
                            styles.customPickerButton,
                            !!error && styles.customPickerButtonError,
                        ]}
                        onPress={() => setShowPicker(true)}
                    >
                        <View style={styles.customPickerButtonContent}>
                            {selectedOption ? (
                                <>
                                    {selectedOption.emoji && (
                                        <Text style={styles.customPickerEmoji}>
                                            {selectedOption.emoji}
                                        </Text>
                                    )}
                                    <Text style={styles.customPickerText}>
                                        {selectedOption.label}
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.customPickerPlaceholder}>
                                    {placeholder}
                                </Text>
                            )}
                        </View>
                        <Text style={styles.customPickerArrow}>▼</Text>
                    </TouchableOpacity>

                    <Modal
                        visible={showPicker}
                        transparent={true}
                        animationType="slide"
                        onRequestClose={() => setShowPicker(false)}
                    >
                        <TouchableOpacity
                            style={styles.modalOverlay}
                            activeOpacity={1}
                            onPress={() => setShowPicker(false)}
                        >
                            <View
                                style={styles.modalContent}
                                onStartShouldSetResponder={() => true}
                            >
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{label}</Text>
                                    <TouchableOpacity
                                        style={styles.modalCloseButton}
                                        onPress={() => setShowPicker(false)}
                                    >
                                        <Text style={styles.modalCloseText}>Listo</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.modalOptions}>
                                    {options.map((option) => (
                                        <TouchableOpacity
                                            key={option.value}
                                            style={[
                                                styles.modalOption,
                                                value === option.value &&
                                                styles.modalOptionSelected,
                                            ]}
                                            onPress={() => {
                                                onChange(option.value);
                                                setShowPicker(false);
                                            }}
                                        >
                                            {option.emoji && (
                                                <Text style={styles.modalOptionEmoji}>
                                                    {option.emoji}
                                                </Text>
                                            )}
                                            <Text style={styles.modalOptionText}>
                                                {option.label}
                                            </Text>
                                            {value === option.value && (
                                                <Text style={styles.modalOptionCheck}>✓</Text>
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </Modal>
                </>
            ) : (
                <View
                    style={[
                        styles.pickerContainer,
                        !!error && styles.pickerContainerError,
                    ]}
                >
                    <Picker
                        selectedValue={value}
                        onValueChange={onChange}
                        style={styles.picker}
                        dropdownIconColor={isDark ? "#FFFFFF" : "#111827"}
                    >
                        <Picker.Item label={placeholder} value="" />
                        {options.map((option) => (
                            <Picker.Item
                                key={option.value}
                                label={`${option.emoji ? option.emoji + " " : ""}${option.label}`}
                                value={option.value}
                            />
                        ))}
                    </Picker>
                </View>
            )}
            {error && <Text style={styles.errorText}>❌ {error}</Text>}
        </View>
    );
}
