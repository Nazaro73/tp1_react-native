import { Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useEffect } from 'react';

export default function HomeScreen() {
  useEffect(() => {
    console.log('✅ [HomeScreen] Component mounted');
    
    return () => {
      console.log('🔄 [HomeScreen] Component unmounting');
    };
  }, []);

  const demoItems = [
    { id: '1', title: 'Produit Alpha', description: 'Description du produit Alpha' },
    { id: '42', title: 'Produit Beta', description: 'Description du produit Beta' },
    { id: '123', title: 'Produit Gamma', description: 'Description du produit Gamma' },
  ];

  const handleLinkPress = (id: string) => {
    console.log(`🔗 [HomeScreen] Navigating to detail with ID: ${id}`);
  };

  try {
    console.log('🔄 [HomeScreen] Rendering with', demoItems.length, 'items');
    
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>RN Advanced Labs</Text>
          <Text style={styles.subtitle}>TP2 - Navigation & Deep Linking</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Fonctionnalités</Text>
          <Text style={styles.description}>
            Cette application démontre la navigation avec Expo Router, le passage de paramètres, 
            la persistance d'état et le deep linking.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 Navigation vers les détails</Text>
          <Text style={styles.description}>Cliquez sur un élément pour voir la page de détail :</Text>
          
          {demoItems.map((item) => {
            try {
              return (
                <Link
                  key={item.id}
                  href={`/${item.id}` as const}
                  asChild
                  onPress={() => handleLinkPress(item.id)}
                >
                  <TouchableOpacity style={styles.itemCard}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemDescription}>{item.description}</Text>
                    <Text style={styles.itemId}>ID: {item.id}</Text>
                  </TouchableOpacity>
                </Link>
              );
            } catch (linkError) {
              console.log(`🔴 [HomeScreen] Error rendering link for item ${item.id}:`, linkError);
              return (
                <TouchableOpacity key={item.id} style={[styles.itemCard, styles.errorCard]}>
                  <Text style={styles.itemTitle}>Error: {item.title}</Text>
                  <Text style={styles.errorText}>Navigation indisponible</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔗 Deep Linking Test</Text>
          <Text style={styles.description}>
            Testez ces URLs dans votre navigateur ou via ADB :{'\n'}
            • rnadvancedlabs://detail/42{'\n'}
            • rnadvancedlabs://detail/123{'\n'}
            • rnadvancedlabs://tp1-profile-card
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💾 Persistance</Text>
          <Text style={styles.description}>
            L'état de navigation est automatiquement persisté. 
            Essayez de naviguer puis fermer/rouvrir l'app !
          </Text>
        </View>
      </ScrollView>
    );
  } catch (error) {
    console.log('🔴 [HomeScreen] Render error:', error);
    
    // Fallback UI
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorTitle}>Erreur d'affichage</Text>
        <Text style={styles.errorText}>
          Une erreur est survenue lors du chargement de la page d'accueil.
        </Text>
        <Text style={styles.errorDetails}>
          Vérifiez la console pour plus de détails.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  section: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    // Style d'ombre compatible web et mobile
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  errorCard: {
    borderLeftColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  itemId: {
    fontSize: 12,
    color: '#9ca3af',
    fontFamily: 'monospace',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});