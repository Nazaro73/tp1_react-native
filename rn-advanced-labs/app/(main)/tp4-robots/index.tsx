import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useRobots, useRobotsActions } from '../../../store/robotsStore';
import { Robot } from '../../../validation/robotSchema';

// Composant pour un item de la liste
interface RobotListItemProps {
  robot: Robot;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const RobotListItem: React.FC<RobotListItemProps> = ({ robot, onEdit, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer "${robot.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => onDelete(robot.id)
        },
      ]
    );
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{robot.name}</Text>
        <Text style={styles.itemLabel}>{robot.label}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemType}>{robot.type}</Text>
          <Text style={styles.itemYear}>{robot.year}</Text>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(robot.id)}
        >
          <Text style={styles.editButtonText}>✏️</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RobotsListScreen() {
  const robots = useRobots();
  const { remove } = useRobotsActions();

  const handleEdit = (id: string) => {
    console.log('✏️ [RobotsList] Édition robot:', id);
    router.push(`/tp4-robots/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    console.log('🗑️ [RobotsList] Suppression robot:', id);
    
    try {
      const result = await remove(id);
      
      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Succès', 'Robot supprimé avec succès');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Erreur', result.error || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('❌ [RobotsList] Erreur suppression:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    }
  };

  const handleCreate = () => {
    console.log('➕ [RobotsList] Création robot');
    router.push('/tp4-robots/create');
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🤖</Text>
      <Text style={styles.emptyTitle}>Aucun robot</Text>
      <Text style={styles.emptyText}>
        Commencez par créer votre premier robot !
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCreate}>
        <Text style={styles.emptyButtonText}>Créer un robot</Text>
      </TouchableOpacity>
    </View>
  );

  const renderRobot = ({ item }: { item: Robot }) => (
    <RobotListItem
      robot={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'TP4 - Robots',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCreate}
            >
              <Text style={styles.createButtonText}>➕</Text>
            </TouchableOpacity>
          )
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Mes Robots</Text>
        <Text style={styles.subtitle}>
          {robots.length} robot{robots.length !== 1 ? 's' : ''} enregistré{robots.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={robots}
        renderItem={renderRobot}
        keyExtractor={(item) => item.id}
        contentContainerStyle={robots.length === 0 ? styles.emptyListContainer : styles.listContainer}
        ListEmptyComponent={renderEmptyList}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton flottant de création */}
      {robots.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleCreate}>
          <Text style={styles.floatingButtonText}>➕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    padding: 16,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  itemLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemType: {
    fontSize: 12,
    color: '#3B82F6',
    backgroundColor: '#EBF8FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  itemYear: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#F3F4F6',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
});