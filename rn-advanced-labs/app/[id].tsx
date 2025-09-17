import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';

// Simulation de données
const getItemData = (id: string) => {
  const items: Record<string, any> = {
    '1': {
      title: 'Produit Alpha',
      description: 'Produit innovant utilisant les dernières technologies React Native',
      details: 'Ce produit démontre les capacités avancées de navigation avec Expo Router et React Navigation. Il utilise le file-based routing pour une architecture modulaire et maintenable.',
      price: '99.99€',
      category: 'Tech',
      features: ['Navigation fluide', 'Deep linking', 'Persistance d\'état', 'File-based routing']
    },
    '42': {
      title: 'Produit Beta',
      description: 'Solution complète pour applications mobiles modernes',
      details: 'Intégration parfaite avec Expo Router et Stack Navigation. Gestion automatique des headers natifs et boutons de retour pour une expérience utilisateur optimale.',
      price: '149.99€',
      category: 'Premium',
      features: ['Architecture modulaire', 'TypeScript', 'Hot reload', 'Headers natifs']
    },
    '123': {
      title: 'Produit Gamma',
      description: 'Framework avancé pour développeurs expérimentés',
      details: 'Outils professionnels pour créer des applications performantes avec navigation Stack + Tabs. Configuration complète du deep linking et persistance d\'état.',
      price: '199.99€',
      category: 'Pro',
      features: ['Performance optimisée', 'Tests intégrés', 'Documentation complète', 'Deep linking avancé']
    }
  };
  
  return items[id] || null;
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`[DetailScreen] Loaded with ID: ${id}`);
    
    // Simulation d'un appel API
    const timer = setTimeout(() => {
      if (id) {
        const data = getItemData(id);
        setItem(data);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [id]);

  // Gestion du titre dynamique dans le header
  const getScreenTitle = () => {
    if (loading) return 'Chargement...';
    if (!id) return 'Erreur';
    if (!item) return 'Non trouvé';
    return item.title;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Chargement...' }} />
        <View style={styles.center}>
          <Text style={styles.loadingText}>Chargement des données...</Text>
        </View>
      </View>
    );
  }

  if (!id) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Erreur' }} />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Paramètre manquant</Text>
          <Text style={styles.errorText}>L'ID du produit est requis pour afficher les détails</Text>
          <Link href="/(main)/home" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Non trouvé' }} />
        <View style={styles.center}>
          <Text style={styles.errorTitle}>Produit non trouvé</Text>
          <Text style={styles.errorText}>ID: {id}</Text>
          <Text style={styles.errorDescription}>
            Ce produit n'existe pas dans notre base de données.
            Essayez avec les IDs: 1, 42, ou 123.
          </Text>
          <Link href="/(main)/home" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: item.title,
          headerStyle: { backgroundColor: '#3b82f6' },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.id}>ID: {id}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.category}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>{item.price}</Text>
        <Text style={styles.description}>{item.description}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails techniques</Text>
          <Text style={styles.details}>{item.details}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités</Text>
          {item.features.map((feature: string, index: number) => (
            <View key={index} style={styles.featureRow}>
              <Text style={styles.featureBullet}>•</Text>
              <Text style={styles.feature}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Navigation Test</Text>
          <Text style={styles.infoText}>
            Vous êtes arrivé ici via :{'\n'}
            Route: /[id] avec id = "{id}"{'\n'}
            Navigation: Stack avec header natif{'\n'}
            Bouton retour: Automatique
          </Text>
          
          <Link href={`/${parseInt(id) + 1}`} asChild>
            <TouchableOpacity style={styles.navButton}>
              <Text style={styles.navButtonText}>
                Voir produit suivant (ID: {parseInt(id) + 1})
              </Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(main)/home" asChild>
            <TouchableOpacity style={[styles.navButton, styles.homeButton]}>
              <Text style={styles.navButtonText}>Retour à l'accueil</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  id: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadge: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  category: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  details: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 22,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  featureBullet: {
    fontSize: 16,
    color: '#3b82f6',
    marginRight: 8,
    fontWeight: 'bold',
  },
  feature: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'monospace',
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    lineHeight: 18,
  },
  navButton: {
    backgroundColor: '#3b82f6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  homeButton: {
    backgroundColor: '#6b7280',
  },
  navButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  backButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});