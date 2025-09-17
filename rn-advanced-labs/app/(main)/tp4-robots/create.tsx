import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, router } from 'expo-router';
import { RobotForm } from '../../../components/RobotForm';
import { useRobotsActions } from '../../../store/robotsStore';
import { RobotFormValues } from '../../../validation/robotSchema';

export default function CreateRobotScreen() {
  const { create } = useRobotsActions();

  const handleSubmit = async (data: RobotFormValues) => {
    console.log('📝 [CreateRobot] Création robot:', data);
    
    const result = await create(data);
    
    if (result.success) {
      console.log('✅ [CreateRobot] Robot créé avec succès');
      router.back(); // Retour à la liste
    }
    
    return result;
  };

  const handleCancel = () => {
    console.log('❌ [CreateRobot] Annulation');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Nouveau Robot',
          headerBackTitle: 'Retour',
        }} 
      />
      
      <RobotForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Créer le robot"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});