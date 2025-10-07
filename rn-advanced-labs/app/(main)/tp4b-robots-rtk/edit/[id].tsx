import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { saveRobotAsync } from '../../../../features/robots/robotsSlice';
import { selectRobotById, selectRobotsLoading, selectRobotsError } from '../../../../features/robots/selectors';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadow } from '../../../../utils/shadows';
import { RobotType, type RobotInput, type RobotTypeValue } from '../../../../validation/robotSchema';

export default function TP4BRobotsEdit() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const primaryGreen = '#10B981';
  const cardColor = '#f8f9fa';
  
  // Sélecteurs Redux
  const robot = useAppSelector(state => selectRobotById(id!)(state));
  const isLoading = useAppSelector(selectRobotsLoading);
  const error = useAppSelector(selectRobotsError);

  // État local du formulaire
  const [formData, setFormData] = useState<RobotInput>({
    name: '',
    label: '',
    year: new Date().getFullYear(),
    type: 'industrial' as RobotTypeValue,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RobotInput, string>>>({});

  // Initialiser le formulaire avec les données du robot
  useEffect(() => {
    if (robot) {
      setFormData({
        name: robot.name,
        label: robot.label,
        year: robot.year,
        type: robot.type,
      });
    }
  }, [robot]);

  // Redirection si robot non trouvé
  useEffect(() => {
    if (!robot && !isLoading) {
      Alert.alert('Erreur', 'Robot non trouvé', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [robot, isLoading]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RobotInput, string>> = {};
    const currentYear = new Date().getFullYear();

    // Validation du nom (min 2, requis)
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation du label (min 3, requis)
    if (!formData.label.trim()) {
      newErrors.label = 'Le label est requis';
    } else if (formData.label.trim().length < 3) {
      newErrors.label = 'Le label doit contenir au moins 3 caractères';
    }

    // Validation de l'année (entier, dans [1950, année courante])
    if (!formData.year || isNaN(formData.year)) {
      newErrors.year = 'L\'année est requise';
    } else if (!Number.isInteger(formData.year)) {
      newErrors.year = 'L\'année doit être un nombre entier';
    } else if (formData.year < 1950) {
      newErrors.year = 'L\'année doit être supérieure ou égale à 1950';
    } else if (formData.year > currentYear) {
      newErrors.year = `L'année ne peut pas dépasser ${currentYear}`;
    }

    // Le type est déjà validé par l'enum dans TypeScript
    if (!formData.type) {
      newErrors.type = 'Le type est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !robot) return;

    console.log('✏️ [TP4B-Edit] Modification via Redux:', formData);
    
    try {
      await dispatch(saveRobotAsync({
        robot: formData,
        mode: 'update',
        id: robot.id,
      })).unwrap();
      
      console.log('✅ [TP4B-Edit] Robot modifié avec succès');
      router.back();
    } catch (error) {
      console.error('❌ [TP4B-Edit] Erreur modification:', error);
      Alert.alert('Erreur', typeof error === 'string' ? error : 'Erreur lors de la modification');
    }
  };

  const handleCancel = () => {
    console.log('❌ [TP4B-Edit] Annulation modification');
    router.back();
  };

  const robotTypeOptions = [
    { value: RobotType.INDUSTRIAL, label: 'Industriel' },
    { value: RobotType.SERVICE, label: 'Service' },
    { value: RobotType.MEDICAL, label: 'Médical' },
    { value: RobotType.EDUCATIONAL, label: 'Éducatif' },
    { value: RobotType.OTHER, label: 'Autre' },
  ];

  // Vérifier si le formulaire est complet
  const isFormComplete =
    formData.name.trim().length >= 2 &&
    formData.label.trim().length >= 3 &&
    formData.year >= 1950 &&
    formData.year <= new Date().getFullYear() &&
    Number.isInteger(formData.year) &&
    formData.type;

  // Chargement
  if (isLoading && !robot) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryGreen} />
        <ThemedText style={styles.loadingText}>Chargement du robot...</ThemedText>
      </ThemedView>
    );
  }

  // Robot non trouvé
  if (!robot) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText style={styles.errorTitle}>Robot non trouvé</ThemedText>
        <TouchableOpacity
          style={[styles.button, styles.submitButton, { backgroundColor: primaryGreen }]}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.submitButtonText}>Retour</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <ThemedText style={styles.title}>Modifier le Robot</ThemedText>
          <ThemedText style={[styles.subtitle, { color: primaryGreen }]}>
            TP4-B: Redux Toolkit
          </ThemedText>

          {/* Formulaire */}
          <View style={[styles.form, createShadow(2), { backgroundColor: cardColor }]}>
            {/* Nom */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Nom du robot *</ThemedText>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={formData.name}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, name: text }));
                  if (errors.name) {
                    setErrors(prev => ({ ...prev, name: undefined }));
                  }
                }}
                placeholder="Ex: R2-D2"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {errors.name && <ThemedText style={styles.errorText}>{errors.name}</ThemedText>}
              <ThemedText style={styles.helperText}>Minimum 2 caractères, unique</ThemedText>
            </View>

            {/* Label */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Label/Description *</ThemedText>
              <TextInput
                style={[styles.input, errors.label && styles.inputError]}
                value={formData.label}
                onChangeText={(text) => {
                  setFormData(prev => ({ ...prev, label: text }));
                  if (errors.label) {
                    setErrors(prev => ({ ...prev, label: undefined }));
                  }
                }}
                placeholder="Ex: Droïde astromécanique"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="sentences"
                returnKeyType="next"
              />
              {errors.label && <ThemedText style={styles.errorText}>{errors.label}</ThemedText>}
              <ThemedText style={styles.helperText}>Minimum 3 caractères</ThemedText>
            </View>

            {/* Année */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Année de fabrication *</ThemedText>
              <TextInput
                style={[styles.input, errors.year && styles.inputError]}
                value={formData.year.toString()}
                onChangeText={(text) => {
                  const year = parseInt(text);
                  setFormData(prev => ({ ...prev, year: isNaN(year) ? new Date().getFullYear() : year }));
                  if (errors.year) {
                    setErrors(prev => ({ ...prev, year: undefined }));
                  }
                }}
                placeholder={`Ex: ${new Date().getFullYear()}`}
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                returnKeyType="done"
                maxLength={4}
              />
              {errors.year && <ThemedText style={styles.errorText}>{errors.year}</ThemedText>}
              <ThemedText style={styles.helperText}>Entre 1950 et {new Date().getFullYear()}</ThemedText>
            </View>

            {/* Type */}
            <View style={styles.fieldContainer}>
              <ThemedText style={styles.label}>Type de robot *</ThemedText>
              <View style={styles.typeContainer}>
                {robotTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.typeOption,
                      formData.type === option.value && { backgroundColor: primaryGreen },
                    ]}
                    onPress={() => setFormData(prev => ({ ...prev, type: option.value }))}
                  >
                    <ThemedText
                      style={[
                        styles.typeOptionText,
                        formData.type === option.value && styles.typeOptionTextSelected,
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Boutons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <ThemedText style={styles.cancelButtonText}>Annuler</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.submitButton,
                  { backgroundColor: primaryGreen },
                  (!isFormComplete || isLoading) && styles.submitButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={!isFormComplete || isLoading}
              >
                <ThemedText style={styles.submitButtonText}>
                  {isLoading ? 'Modification...' : 'Modifier le robot'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Erreur globale */}
            {error && (
              <View style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>❌ {error}</ThemedText>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  inputError: {
    borderColor: '#FF6B6B',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    fontStyle: 'italic',
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeOption: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  typeOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  typeOptionTextSelected: {
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorContainer: {
    backgroundColor: '#fee',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
});