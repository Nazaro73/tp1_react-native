import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as Haptics from 'expo-haptics';
import { 
  robotValidationSchema, 
  RobotFormValues, 
  defaultRobotValues,
  robotTypeOptions,
  robotTypeLabels,
  RobotTypeValue,
} from '../validation/robotSchema';
import { useRobotsActions } from '../store/robotsStore';

// Composant Picker simple pour le type de robot
interface RobotTypePickerProps {
  value: RobotTypeValue;
  onValueChange: (value: RobotTypeValue) => void;
  error?: string;
}

const RobotTypePicker: React.FC<RobotTypePickerProps> = ({ value, onValueChange, error }) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>Type de robot *</Text>
      <View style={styles.pickerContainer}>
        {robotTypeOptions.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.pickerOption,
              value === option.value && styles.pickerOptionSelected,
              error && styles.pickerOptionError,
            ]}
            onPress={() => onValueChange(option.value)}
          >
            <Text style={[
              styles.pickerOptionText,
              value === option.value && styles.pickerOptionTextSelected,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

// Props du composant RobotForm
interface RobotFormProps {
  initialValues?: Partial<RobotFormValues>;
  onSubmit: (data: RobotFormValues) => Promise<{ success: boolean; error?: string }>;
  onCancel?: () => void;
  submitButtonText?: string;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export const RobotForm: React.FC<RobotFormProps> = ({
  initialValues = {},
  onSubmit,
  onCancel,
  submitButtonText = 'Enregistrer',
  mode,
  isLoading = false,
}) => {
  const labelRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);
  
  const { isNameUnique } = useRobotsActions();

  // Form avec validation Zod
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
    setError,
    clearErrors,
  } = useForm<RobotFormValues>({
    resolver: zodResolver(robotValidationSchema),
    defaultValues: {
      ...defaultRobotValues,
      ...initialValues,
    },
    mode: 'onChange',
  });

  // Watch pour logs de debug
  const watchedValues = watch();
  useEffect(() => {
    console.log('🔄 [RobotForm] Form state:', { 
      isValid, 
      errors: Object.keys(errors),
      mode,
    });
  }, [isValid, errors, mode]);

  // Validation de l'unicité du nom
  const validateNameUniqueness = (name: string) => {
    if (mode === 'create') {
      if (!isNameUnique(name)) {
        setError('name', { 
          type: 'manual', 
          message: 'Un robot avec ce nom existe déjà' 
        });
        return false;
      }
    }
    clearErrors('name');
    return true;
  };

  const handleFormSubmit = async (data: RobotFormValues) => {
    console.log('📝 [RobotForm] Soumission du formulaire:', data);
    
    try {
      // Validation finale de l'unicité
      if (mode === 'create' && !validateNameUniqueness(data.name)) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      }

      const result = await onSubmit(data);
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          'Succès !',
          mode === 'create' 
            ? `Le robot "${data.name}" a été créé avec succès.`
            : `Le robot "${data.name}" a été mis à jour avec succès.`,
          [{ text: 'OK' }]
        );
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Erreur', result.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error('❌ [RobotForm] Erreur soumission:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Nom du robot *</Text>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="Ex: R2-D2"
                  value={value}
                  onChangeText={(text) => {
                    onChange(text);
                    if (mode === 'create') {
                      validateNameUniqueness(text);
                    }
                  }}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => labelRef.current?.focus()}
                  autoCapitalize="words"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </View>

          {/* Label */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description *</Text>
            <Controller
              name="label"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={labelRef}
                  style={[styles.input, errors.label && styles.inputError]}
                  placeholder="Ex: Droïde astromech de série R2"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  returnKeyType="next"
                  onSubmitEditing={() => yearRef.current?.focus()}
                  multiline
                  numberOfLines={2}
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.label && <Text style={styles.errorText}>{errors.label.message}</Text>}
          </View>

          {/* Année */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Année de fabrication *</Text>
            <Controller
              name="year"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={yearRef}
                  style={[styles.input, errors.year && styles.inputError]}
                  placeholder={`Ex: ${new Date().getFullYear()}`}
                  value={value.toString()}
                  onChangeText={(text) => {
                    const numValue = parseInt(text, 10);
                    onChange(isNaN(numValue) ? 0 : numValue);
                  }}
                  onBlur={onBlur}
                  keyboardType="numeric"
                  returnKeyType="done"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.year && <Text style={styles.errorText}>{errors.year.message}</Text>}
          </View>

          {/* Type de robot */}
          <Controller
            name="type"
            control={control}
            render={({ field: { onChange, value } }) => (
              <RobotTypePicker
                value={value}
                onValueChange={onChange}
                error={errors.type?.message}
              />
            )}
          />

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!isValid || isSubmitting || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit(handleFormSubmit)}
              disabled={!isValid || isSubmitting || isLoading}
            >
              <Text style={[
                styles.submitButtonText,
                (!isValid || isSubmitting || isLoading) && styles.submitButtonTextDisabled
              ]}>
                {isSubmitting || isLoading ? 'Enregistrement...' : submitButtonText}
              </Text>
            </TouchableOpacity>

            {onCancel && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={onCancel}
                disabled={isSubmitting || isLoading}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Debug info */}
          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              Debug: isValid = {isValid.toString()}, erreurs = {Object.keys(errors).length}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    minHeight: 48,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  pickerOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  pickerOptionError: {
    borderColor: '#EF4444',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  pickerOptionTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginTop: 20,
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#D1D5DB',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  debugInfo: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: 'monospace',
  },
});