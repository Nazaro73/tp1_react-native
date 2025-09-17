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
import { Formik, Field } from 'formik';
import { Stack, Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { registrationSchema, initialValues, FormValues } from './validation/schema';
import { FormField } from './components/FormField';
import { CheckboxField } from './components/CheckboxField';

export default function FormikFormScreen() {
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const displayNameRef = useRef<TextInput>(null);
  const submitButtonRef = useRef<View>(null);

  // Log pour mesurer les re-rendus
  useEffect(() => {
    console.log('🔄 [Formik] FormikFormScreen re-rendered');
  });

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    console.log('📊 [Formik] Form submitted with values:', values);
    
    try {
      // Simulation d'un appel API
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Haptique de succès
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Inscription réussie !',
        `Bienvenue ${values.displayName} ! Votre compte a été créé avec l'email ${values.email}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              console.log('✅ [Formik] Form reset after success');
            }
          }
        ]
      );
    } catch (error) {
      // Haptique d'erreur
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          title: 'TP3 - Formik + Yup',
          headerRight: () => (
            <Link href="/TP3-forms/rhf" asChild>
              <TouchableOpacity style={styles.switchButton}>
                <Text style={styles.switchButtonText}>RHF</Text>
              </TouchableOpacity>
            </Link>
          )
        }} 
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Implémentation avec Formik + Yup</Text>
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={registrationSchema}
          onSubmit={handleSubmit}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ handleSubmit, isValid, isSubmitting, errors, touched }) => {
            // Log pour observer les re-rendus
            console.log('🔄 [Formik] Form render - isValid:', isValid, 'errors:', Object.keys(errors));
            
            return (
              <View style={styles.form}>
                <Field
                  name="email"
                  component={FormField}
                  label="Email"
                  placeholder="votre@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordRef.current?.focus()}
                  error={errors.email}
                  touched={touched.email}
                />

                <Field
                  name="password"
                  component={FormField}
                  label="Mot de passe"
                  placeholder="Votre mot de passe"
                  secureTextEntry
                  returnKeyType="next"
                  ref={passwordRef}
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  error={errors.password}
                  touched={touched.password}
                />

                <Field
                  name="confirmPassword"
                  component={FormField}
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  secureTextEntry
                  returnKeyType="next"
                  ref={confirmPasswordRef}
                  onSubmitEditing={() => displayNameRef.current?.focus()}
                  error={errors.confirmPassword}
                  touched={touched.confirmPassword}
                />

                <Field
                  name="displayName"
                  component={FormField}
                  label="Nom d'affichage"
                  placeholder="Votre nom d'affichage"
                  returnKeyType="done"
                  ref={displayNameRef}
                  onSubmitEditing={() => submitButtonRef.current?.focus()}
                  error={errors.displayName}
                  touched={touched.displayName}
                />

                <Field
                  name="termsAccepted"
                  component={CheckboxField}
                  label="J'accepte les conditions d'utilisation et la politique de confidentialité"
                  error={errors.termsAccepted}
                  touched={touched.termsAccepted}
                />

                <TouchableOpacity
                  ref={submitButtonRef}
                  style={[
                    styles.submitButton,
                    (!isValid || isSubmitting) && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit as any}
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
            );
          }}
        </Formik>
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