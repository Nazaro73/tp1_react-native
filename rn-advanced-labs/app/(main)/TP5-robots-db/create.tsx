import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { RobotType, RobotTypeValue, robotTypeLabels } from '../../../validation/robotSchema';
import { robotRepo } from '../../../services/robotRepo';

export default function TP5CreateRobot() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    year: new Date().getFullYear(),
    type: RobotType.OTHER as RobotTypeValue,
  });

  // Validation en temps réel
  const isFormComplete =
    formData.name.trim().length >= 2 &&
    formData.label.trim().length >= 3 &&
    formData.year >= 1950 &&
    formData.year <= new Date().getFullYear() &&
    Number.isInteger(formData.year) &&
    formData.type;

  const handleSubmit = async () => {
    if (!isFormComplete) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs correctement');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 [TP5-Create] Création robot:', formData);
      await robotRepo.create(formData);
      Alert.alert('Succès', 'Robot créé avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ [TP5-Create] Erreur:', error);
      Alert.alert('Erreur', error.message || 'Impossible de créer le robot');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nouveau Robot</Text>
          <Text style={styles.subtitle}>Ajouter un robot à la base de données</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* Nom */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Nom <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="EX: R2-D2"
              placeholderTextColor="#9CA3AF"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              editable={!loading}
            />
            <Text style={styles.helper}>Minimum 2 caractères</Text>
          </View>

          {/* Label */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Label <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="EX: Droïde astromécanique"
              placeholderTextColor="#9CA3AF"
              value={formData.label}
              onChangeText={(text) => setFormData({ ...formData, label: text })}
              editable={!loading}
            />
            <Text style={styles.helper}>Minimum 3 caractères</Text>
          </View>

          {/* Année */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Année <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="EX: 2024"
              placeholderTextColor="#9CA3AF"
              value={formData.year.toString()}
              onChangeText={(text) => {
                const num = parseInt(text, 10);
                setFormData({ ...formData, year: isNaN(num) ? new Date().getFullYear() : num });
              }}
              keyboardType="numeric"
              editable={!loading}
            />
            <Text style={styles.helper}>Entre 1950 et {new Date().getFullYear()}</Text>
          </View>

          {/* Type */}
          <View style={styles.field}>
            <Text style={styles.label}>
              Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.typeGrid}>
              {Object.entries(robotTypeLabels).map(([value, label]) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.typeButton,
                    formData.type === value && styles.typeButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, type: value as RobotTypeValue })}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      formData.type === value && styles.typeButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (!isFormComplete || loading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormComplete || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Créer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingTop: 24,
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
    paddingTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  helper: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  typeButtonActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#F3E8FF',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  typeButtonTextActive: {
    color: '#8B5CF6',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
