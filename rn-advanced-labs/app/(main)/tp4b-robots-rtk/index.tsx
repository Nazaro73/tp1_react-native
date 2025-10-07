import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createShadow } from '../../../utils/shadows';
import {
  useAppSelector,
  useAppDispatch
} from '../../redux/hooks';
import {
  selectRobotsSortedByName,
  selectRobotsUIState,
  selectRobotsStats
} from '../../../features/robots/selectors';
import {
  loadRobots,
  deleteRobot
} from '../../../features/robots/robotsSlice';
import type { Robot } from '../../../validation/robotSchema';

export default function TP4BRobotsIndex() {
  const dispatch = useAppDispatch();
  
  // Sélecteurs Redux
  const robots = useAppSelector(selectRobotsSortedByName);
  const uiState = useAppSelector(selectRobotsUIState);
  const stats = useAppSelector(selectRobotsStats);
  
  // Couleurs du thème - Version verte (TP4B)
  const primaryGreen = '#10B981'; // Vert principal
  const lightGreen = '#D1FAE5'; // Vert clair pour badges
  const backgroundColor = '#F9FAFB'; // Gris clair
  const cardColor = '#FFFFFF';
  const borderColor = '#E5E7EB';
  const textColor = '#1F2937';
  const secondaryTextColor = '#6B7280';
  const dangerColor = '#ef4444';

  // Charger les robots au montage
  useEffect(() => {
    console.log('🏠 [TP4B-Index] Chargement des robots via Redux');
    dispatch(loadRobots());
  }, [dispatch]);

  const handleRefresh = () => {
    console.log('🔄 [TP4B-Index] Actualisation des robots');
    dispatch(loadRobots());
  };

  const handleCreate = () => {
    console.log('➕ [TP4B-Index] Navigation vers création');
    router.push('/tp4b-robots-rtk/create');
  };

  const handleEdit = (robot: Robot) => {
    console.log('✏️ [TP4B-Index] Navigation vers édition:', robot.name);
    router.push(`/tp4b-robots-rtk/edit/${robot.id}`);
  };

  const handleDelete = (robot: Robot) => {
    console.log('🗑️ [TP4B-Index] Demande suppression:', robot.name);
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer "${robot.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            console.log('🗑️ [TP4B-Index] Suppression confirmée:', robot.name);
            dispatch(deleteRobot(robot.id));
          },
        },
      ]
    );
  };

  const renderRobot = ({ item }: { item: Robot }) => (
    <View style={[styles.robotCard, { backgroundColor: cardColor }]}>
      <View style={styles.robotContent}>
        <ThemedText style={[styles.robotName, { color: textColor }]}>{item.name}</ThemedText>
        <ThemedText style={[styles.robotLabel, { color: secondaryTextColor }]}>
          {item.label}
        </ThemedText>
        <View style={styles.robotMeta}>
          <View style={[styles.robotTypeBadge, { backgroundColor: lightGreen }]}>
            <ThemedText style={[styles.robotType, { color: primaryGreen }]}>
              {item.type}
            </ThemedText>
          </View>
          <ThemedText style={[styles.robotYear, { color: secondaryTextColor }]}>
            {item.year}
          </ThemedText>
        </View>
      </View>

      <View style={styles.robotActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <ThemedText style={styles.editButtonText}>✏️</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <ThemedText style={styles.emptyStateEmoji}>🤖</ThemedText>
      <ThemedText style={[styles.emptyStateTitle, { color: textColor }]}>Aucun robot</ThemedText>
      <ThemedText style={[styles.emptyStateText, { color: secondaryTextColor }]}>
        Commencez par créer votre premier robot !
      </ThemedText>
      <TouchableOpacity
        onPress={handleCreate}
        style={[styles.emptyStateButton, { backgroundColor: primaryGreen }]}
      >
        <ThemedText style={styles.emptyStateButtonText}>Créer un robot</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: cardColor, borderBottomColor: borderColor }]}>
      <ThemedText style={[styles.title, { color: textColor }]}>Mes Robots</ThemedText>
      <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
        {robots.length} robot{robots.length !== 1 ? 's' : ''} enregistré{robots.length !== 1 ? 's' : ''}
      </ThemedText>
    </View>
  );

  if (uiState.hasError) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.errorState}>
          <ThemedText style={styles.errorEmoji}>⚠️</ThemedText>
          <ThemedText style={[styles.errorTitle, { color: textColor }]}>Erreur</ThemedText>
          <ThemedText style={[styles.errorText, { color: secondaryTextColor }]}>
            {uiState.error || 'Une erreur est survenue'}
          </ThemedText>
          <TouchableOpacity
            onPress={handleRefresh}
            style={[styles.retryButton, { backgroundColor: primaryGreen }]}
          >
            <ThemedText style={styles.retryButtonText}>🔄 Recharger</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={robots}
        renderItem={renderRobot}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!uiState.isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={uiState.isLoading}
            onRefresh={handleRefresh}
            tintColor={primaryGreen}
            colors={[primaryGreen]}
          />
        }
      />
      
      {/* Bouton flottant d'ajout */}
      {robots.length > 0 && (
        <TouchableOpacity
          onPress={handleCreate}
          style={[styles.fab, { backgroundColor: primaryGreen }]}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.fabText}>+</ThemedText>
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },

  // Robot cards - Style TP4A
  robotCard: {
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
  robotContent: {
    flex: 1,
  },
  robotName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  robotLabel: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  robotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  robotTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  robotType: {
    fontSize: 12,
    fontWeight: '500',
  },
  robotYear: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  robotActions: {
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

  // États vides
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Erreur
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
    textAlign: 'center',
  },
});