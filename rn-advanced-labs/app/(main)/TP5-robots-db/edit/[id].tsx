import React, { useState, useEffect } from 'react';
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
import { router, useLocalSearchParams } from 'expo-router';
import { Robot, RobotType, RobotTypeValue, robotTypeLabels } from '../../../../validation/robotSchema';
import { robotRepo } from '../../../../services/robotRepo';

export default function TP5EditRobot() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [robot, setRobot] = useState<Robot | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    year: new Date().getFullYear(),
    type: RobotType.OTHER as RobotTypeValue,
  });

  // Charger le robot
  useEffect(() => {
    const loadRobot = async () => {
      try {
        console.log('📖 [TP5-Edit] Chargement robot:', id);
        const data = await robotRepo.getById(id);

        if (!data) {
          Alert.alert('Erreur', 'Robot introuvable', [
            { text: 'OK', onPress: () => router.back() },
          ]);
          return;
        }

        setRobot(data);
        setFormData({
          name: data.name,
          label: data.label,
          year: data.year,
          type: data.type,
        });
        console.log('✅ [TP5-Edit] Robot chargé:', data.name);
      } catch (error) {
        console.error('❌ [TP5-Edit] Erreur chargement:', error);
        Alert.alert('Erreur', 'Impossible de charger le robot', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadRobot();
  }, [id]);

  // Validation en temps réel
  const isFormComplete =
    formData.name.trim().length >= 2 &&
    formData.label.trim().length >= 3 &&
    formData.year >= 1950 &&
    formData.year <= new Date().getFullYear() &&
    Number.isInteger(formData.year) &&
    formData.type;

  // Vérifie si le formulaire a été modifié
  const isFormChanged =
    robot &&
    (formData.name !== robot.name ||
      formData.label !== robot.label ||
      formData.year !== robot.year ||
      formData.type !== robot.type);

  const handleSubmit = async () => {
    if (!isFormComplete || !isFormChanged) {
      return;
    }

    setSaving(true);
    try {
      console.log('💾 [TP5-Edit] Mise à jour robot:', id);
      await robotRepo.update(id, formData);
      Alert.alert('Succès', 'Robot mis à jour avec succès', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      console.error('❌ [TP5-Edit] Erreur:', error);
      Alert.alert('Erreur', error.message || 'Impossible de mettre à jour le robot');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // Loading state
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement du robot...</Text>
      </View>
    );
  }

  if (!robot) {
    return null;
  }

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
          <Text style={styles.title}>Modifier le Robot</Text>
          <Text style={styles.subtitle}>Éditer {robot.name}</Text>
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
              editable={!saving}
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
              editable={!saving}
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
              editable={!saving}
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
                  disabled={saving}
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

          {/* Métadonnées */}
          {robot.created_at && (
            <View style={styles.metadata}>
              <Text style={styles.metadataLabel}>Créé le:</Text>
              <Text style={styles.metadataValue}>
                {new Date(robot.created_at * 1000).toLocaleString('fr-FR')}
              </Text>
            </View>
          )}
          {robot.updated_at && (
            <View style={styles.metadata}>
              <Text style={styles.metadataLabel}>Modifié le:</Text>
              <Text style={styles.metadataValue}>
                {new Date(robot.updated_at * 1000).toLocaleString('fr-FR')}
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Annuler</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.submitButton,
              (!isFormComplete || !isFormChanged || saving) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormComplete || !isFormChanged || saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Enregistrer</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
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
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  metadataLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
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
