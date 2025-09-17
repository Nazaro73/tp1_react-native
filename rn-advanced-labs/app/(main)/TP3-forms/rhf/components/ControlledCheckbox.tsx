import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Control, Controller, FieldError } from 'react-hook-form';

interface ControlledCheckboxProps {
  name: string;
  control: Control<any>;
  label: string;
  error?: FieldError;
}

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({
  name,
  control,
  label,
  error
}) => {
  return (
    <View style={styles.container}>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value } }) => (
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => onChange(!value)}
          >
            <View style={[styles.checkbox, value && styles.checkboxChecked]}>
              {value && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.label}>{label}</Text>
          </TouchableOpacity>
        )}
      />
      {error && <Text style={styles.errorText}>{error.message}</Text>}
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