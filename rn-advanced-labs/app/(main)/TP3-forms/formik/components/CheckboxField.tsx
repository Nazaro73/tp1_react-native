import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FieldProps } from 'formik';

interface CheckboxFieldProps extends FieldProps {
  label: string;
  error?: string;
  touched?: boolean;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  error,
  touched,
  field,
  form
}) => {
  const hasError = touched && error;
  const isChecked = field.value;

  const handlePress = () => {
    form.setFieldValue(field.name, !isChecked);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={handlePress}>
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {hasError && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
});