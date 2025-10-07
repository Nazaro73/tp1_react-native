import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Share,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { Paths, File } from 'expo-file-system';
import { Robot } from '../../../validation/robotSchema';
import { robotRepo } from '../../../services/robotRepo';
import { openDatabase } from '../../../db';

export default function TP5RobotsIndex() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les robots
  const loadRobots = useCallback(async () => {
    try {
      console.log('📋 [TP5-Index] Chargement des robots...');
      const data = await robotRepo.list({
        q: searchQuery,
        sort: 'name',
        order: 'ASC',
      });
      setRobots(data);
      console.log(`✅ [TP5-Index] ${data.length} robots chargés`);
    } catch (error) {
      console.error('❌ [TP5-Index] Erreur chargement:', error);
      Alert.alert('Erreur', 'Impossible de charger les robots');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery]);

  // Initialiser la DB une seule fois
  useEffect(() => {
    const init = async () => {
      try {
        await openDatabase();
      } catch (error) {
        console.error('❌ [TP5-Index] Erreur init DB:', error);
      }
    };
    init();
  }, []);

  // Recharger à chaque fois que la page est affichée
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 [TP5-Index] Page focus - Rechargement...');
      setLoading(true);
      loadRobots();
    }, [loadRobots])
  );

  // Rafraîchir
  const handleRefresh = () => {
    setRefreshing(true);
    loadRobots();
  };

  // Supprimer
  const handleDelete = (robot: Robot) => {
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer "${robot.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await robotRepo.remove(robot.id);
              Alert.alert('Succès', 'Robot supprimé');
              loadRobots();
            } catch (error: any) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  // Créer
  const handleCreate = () => {
    router.push('/TP5-robots-db/create');
  };

  // Éditer
  const handleEdit = (robot: Robot) => {
    router.push(`/TP5-robots-db/edit/${robot.id}`);
  };

  // Exporter en JSON
  const handleExport = async () => {
    try {
      console.log('📤 [TP5-Index] Export des robots...');
      
      const allRobots = await robotRepo.exportToJSON();
      
      if (allRobots.length === 0) {
        Alert.alert('Info', 'Aucun robot à exporter');
        return;
      }

      const jsonData = JSON.stringify(allRobots, null, 2);
      const fileName = `robots_export_${Date.now()}.json`;
      const file = new File(Paths.document, fileName);

      await file.create();
      await file.write(jsonData, {});
      
      console.log(`✅ [TP5-Index] Export réussi: ${file.uri}`);

      Alert.alert(
        'Export réussi',
        `${allRobots.length} robot(s) exporté(s)\n\nFichier: ${fileName}`,
        [
          {
            text: 'Partager',
            onPress: async () => {
              try {
                await Share.share({
                  message: jsonData,
                  title: 'Export Robots',
                });
              } catch (error) {
                console.error('Erreur partage:', error);
              }
            }
          },
          { text: 'OK' }
        ]
      );
    } catch (error: any) {
      console.error('❌ [TP5-Index] Erreur export:', error);
      Alert.alert('Erreur', `Impossible d'exporter: ${error.message}`);
    }
  };

  // Importer depuis JSON
  const handleImport = async () => {
    Alert.alert(
      'Import JSON',
      'Cette fonctionnalité nécessite un sélecteur de fichier.\nPour le moment, vous pouvez créer des robots manuellement.',
      [{ text: 'OK' }]
    );
    
    // TODO: Implémenter avec expo-document-picker
    // const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
    // if (result.type === 'success') {
    //   const content = await FileSystem.readAsStringAsync(result.uri);
    //   const importedRobots = JSON.parse(content);
    //   // Fusionner avec vérification d'unicité...
    // }
  };

  // Render item
  const renderRobot = ({ item }: { item: Robot }) => (
    <View style={styles.robotCard}>
      <View style={styles.robotContent}>
        <Text style={styles.robotName}>{item.name}</Text>
        <Text style={styles.robotLabel}>{item.label}</Text>
        <View style={styles.robotMeta}>
          <View style={styles.robotTypeBadge}>
            <Text style={styles.robotType}>{item.type}</Text>
          </View>
          <Text style={styles.robotYear}>{item.year}</Text>
        </View>
      </View>

      <View style={styles.robotActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Empty state
  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🤖</Text>
      <Text style={styles.emptyTitle}>Aucun robot</Text>
      <Text style={styles.emptyText}>
        {searchQuery
          ? 'Aucun résultat pour cette recherche'
          : 'Commencez par créer votre premier robot !'}
      </Text>
      {!searchQuery && (
        <TouchableOpacity style={styles.emptyButton} onPress={handleCreate}>
          <Text style={styles.emptyButtonText}>Créer un robot</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Loading
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Chargement de la base de données...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TP5 - SQLite Robots</Text>
        <Text style={styles.subtitle}>{robots.length} robot{robots.length !== 1 ? 's' : ''}</Text>
      </View>

      {/* Actions bar */}
      {robots.length > 0 && (
        <View style={styles.actionsBar}>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Text style={styles.exportButtonText}>📤 Exporter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.exportButton, styles.importButton]} onPress={handleImport}>
            <Text style={styles.exportButtonText}>📥 Importer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par nom..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
        />
      </View>

      {/* List */}
      <FlatList
        data={robots}
        renderItem={renderRobot}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      />

      {/* FAB */}
      {robots.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleCreate}>
          <Text style={styles.fabText}>+</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
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
  actionsBar: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  exportButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    alignItems: 'center',
  },
  importButton: {
    backgroundColor: '#10B981',
  },
  exportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    color: '#1F2937',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
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
    color: '#1F2937',
    marginBottom: 4,
  },
  robotLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  robotMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  robotTypeBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  robotType: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  robotYear: {
    fontSize: 12,
    color: '#6B7280',
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
  actionButtonText: {
    fontSize: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
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
  },
  emptyButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
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
  },
});
