import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { registrationSchema, FormValues, defaultValues } from './validation/schema';
import { ControlledTextInput } from './components/ControlledTextInput';
import { ControlledCheckbox } from './components/ControlledCheckbox';

export default function RHFFormScreen() {
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const displayNameRef = useRef<TextInput>(null);

  // Log pour mesurer les re-rendus
  useEffect(() => {
    console.log('🔄 [RHF] RHFFormScreen re-rendered');
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Watch pour debug
  const watchedValues = watch();
  useEffect(() => {
    console.log('🔄 [RHF] Form state - isValid:', isValid, 'errors:', Object.keys(errors));
  }, [isValid, errors]);

  const onSubmit = async (data: FormValues) => {
    console.log('📊 [RHF] Form submitted with values:', data);
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Haptique de succès
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Inscription réussie !',
        `Bienvenue ${data.displayName} ! Votre compte a été créé avec l'email ${data.email}`,
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              console.log('✅ [RHF] Form reset after success');
            }
          }
        ]
      );
    } catch (error) {
      // Haptique d'erreur
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'TP3 - RHF + Zod',
          headerRight: () => (
            <Link href="/TP3-forms/formik" asChild>
              <TouchableOpacity style={styles.switchButton}>
                <Text style={styles.switchButtonText}>Formik</Text>
              </TouchableOpacity>
            </Link>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Implémentation avec React Hook Form + Zod</Text>
        </View>

        <View style={styles.form}>
          <ControlledTextInput
            name="email"
            control={control}
            label="Email"
            placeholder="votre@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
            error={errors.email}
          />

          <ControlledTextInput
            name="password"
            control={control}
            label="Mot de passe"
            placeholder="Votre mot de passe"
            secureTextEntry
            returnKeyType="next"
            ref={passwordRef}
            onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            error={errors.password}
          />

          <ControlledTextInput
            name="confirmPassword"
            control={control}
            label="Confirmer le mot de passe"
            placeholder="Confirmez votre mot de passe"
            secureTextEntry
            returnKeyType="next"
            ref={confirmPasswordRef}
            onSubmitEditing={() => displayNameRef.current?.focus()}
            error={errors.confirmPassword}
          />

          <ControlledTextInput
            name="displayName"
            control={control}
            label="Nom d'affichage"
            placeholder="Votre nom d'affichage"
            returnKeyType="done"
            ref={displayNameRef}
            onSubmitEditing={handleSubmit(onSubmit)}
            error={errors.displayName}
          />

          <ControlledCheckbox
            name="termsAccepted"
            control={control}
            label="J'accepte les conditions d'utilisation et la politique de confidentialité"
            error={errors.termsAccepted}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!isValid || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          >
            <Text style={[
              styles.submitButtonText,
              (!isValid || isSubmitting) && styles.submitButtonTextDisabled
            ]}>
              {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>

          <View style={styles.debugInfo}>
            <Text style={styles.debugText}>
              Debug: isValid = {isValid.toString()}, erreurs = {Object.keys(errors).length}
            </Text>
          </View>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  form: {
    padding: 20,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
  switchButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  switchButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
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