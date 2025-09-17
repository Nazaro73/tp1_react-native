import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { RobotForm } from '../../../../components/RobotForm';
import { useRobotById, useRobotsActions } from '../../../../store/robotsStore';
import { RobotFormValues } from '../../../../validation/robotSchema';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const robot = useRobotById(id || '');
  const { update } = useRobotsActions();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log('🔍 [EditRobot] Chargement robot pour édition:', { id, found: !!robot });
  }, [id, robot]);

  const handleSubmit = async (data: RobotFormValues) => {
    if (!id || !robot) {
      return { success: false, error: 'Robot non trouvé' };
    }

    console.log('📝 [EditRobot] Mise à jour robot:', { id, data });
    setIsLoading(true);
    
    try {
      const result = await update(id, data);
      
      if (result.success) {
        console.log('✅ [EditRobot] Robot mis à jour avec succès');
        router.back(); // Retour à la liste
      }
      
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('❌ [EditRobot] Annulation');
    router.back();
  };

  // Robot non trouvé
  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Erreur' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ID du robot manquant</Text>
        </View>
      </View>
    );
  }

  if (!robot) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Robot introuvable' }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Robot non trouvé</Text>
        </View>
      </View>
    );
  }

  // Formulaire d'édition
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: `Éditer ${robot.name}`,
          headerBackTitle: 'Retour',
        }} 
      />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3B82F6" />
        </View>
      )}
      
      <RobotForm
        mode="edit"
        initialValues={{
          name: robot.name,
          label: robot.label,
          year: robot.year,
          type: robot.type,
        }}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText="Mettre à jour"
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    textAlign: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});