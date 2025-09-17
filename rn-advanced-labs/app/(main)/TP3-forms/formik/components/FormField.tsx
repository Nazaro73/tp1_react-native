import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { FieldProps } from 'formik';

interface FormFieldProps extends FieldProps, TextInputProps {
  label: string;
  error?: string;
  touched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  touched,
  field,
  form,
  ...textInputProps
}) => {
  const hasError = touched && error;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, hasError && styles.inputError]}
        value={field.value}
        onChangeText={field.onChange(field.name)}
        onBlur={field.onBlur(field.name)}
        placeholderTextColor="#9CA3AF"
        {...textInputProps}
      />
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});