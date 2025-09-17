import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';

interface ControlledTextInputProps extends TextInputProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
}

export const ControlledTextInput = forwardRef<TextInput, ControlledTextInputProps>(({
  name,
  control,
  label,
  error,
  ...textInputProps
}, ref) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={ref}
            style={[styles.input, error && styles.inputError]}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor="#9CA3AF"
            {...textInputProps}
          />
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
    </View>
  );
});

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