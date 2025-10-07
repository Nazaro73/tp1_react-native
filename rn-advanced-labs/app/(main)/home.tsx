import { Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { shadows } from '../../utils/shadows';

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
          <Text style={styles.subtitle}>TP2 - Navigation & Deep Linking | TP3 - Forms</Text>
        </View>

        {/* TP3 Forms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 TP3 - Gestion des formulaires</Text>
          <Text style={styles.description}>
            Comparaison entre Formik+Yup et React Hook Form+Zod
          </Text>
          
          <View style={styles.formsContainer}>
            <Link href="/TP3-forms/formik" asChild>
              <TouchableOpacity 
                style={[styles.formCard, styles.formikCard]}
                onPress={() => console.log('🔗 [HomeScreen] Navigation vers Formik')}
              >
                <Text style={styles.formCardTitle}>Formik + Yup</Text>
                <Text style={styles.formCardDescription}>
                  Formulaire d'inscription avec Formik et validation Yup
                </Text>
                <Text style={styles.formCardFeatures}>
                  ✓ Gestion des erreurs{'\n'}
                  ✓ Validation en temps réel{'\n'}
                  ✓ Focus automatique{'\n'}
                  ✓ Feedback haptique
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/TP3-forms/rhf" asChild>
              <TouchableOpacity 
                style={[styles.formCard, styles.rhfCard]}
                onPress={() => console.log('🔗 [HomeScreen] Navigation vers RHF')}
              >
                <Text style={styles.formCardTitle}>React Hook Form + Zod</Text>
                <Text style={styles.formCardDescription}>
                  Formulaire d'inscription avec RHF et validation Zod
                </Text>
                <Text style={styles.formCardFeatures}>
                  ✓ Performance optimisée{'\n'}
                  ✓ TypeScript natif{'\n'}
                  ✓ Moins de re-rendus{'\n'}
                  ✓ API moderne
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* TP4 Robots Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 TP4 - Gestion d'état avec Zustand</Text>
          <Text style={styles.description}>
            CRUD complet de robots avec Zustand et persistance locale
          </Text>
          
          <Link href="/tp4-robots" asChild>
            <TouchableOpacity 
              style={[styles.formCard, styles.zustandCard]}
              onPress={() => console.log('🔗 [HomeScreen] Navigation vers TP4 Robots')}
            >
              <Text style={styles.formCardTitle}>🤖 Robots Manager</Text>
              <Text style={styles.formCardDescription}>
                Application CRUD complète avec Zustand, validation Zod et persistance AsyncStorage
              </Text>
              <Text style={styles.formCardFeatures}>
                ✓ Store global Zustand{'\n'}
                ✓ CRUD complet (Create, Read, Update, Delete){'\n'}
                ✓ Validation robuste avec Zod{'\n'}
                ✓ Persistance automatique{'\n'}
                ✓ Interface mobile optimisée
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* TP4-B Redux Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 TP4-B - Gestion d'état avec Redux Toolkit</Text>
          <Text style={styles.description}>
            Même CRUD avec Redux Toolkit pour comparer les approches de gestion d'état
          </Text>
          
          <Link href="/tp4b-robots-rtk" asChild>
            <TouchableOpacity 
              style={[styles.formCard, styles.reduxCard]}
              onPress={() => console.log('🔗 [HomeScreen] Navigation vers TP4-B Redux')}
            >
              <Text style={styles.formCardTitle}>⚛️ Redux Robots Manager</Text>
              <Text style={styles.formCardDescription}>
                Application CRUD avec Redux Toolkit, thunks asynchrones et persistance redux-persist
              </Text>
              <Text style={styles.formCardFeatures}>
                ✓ Store Redux Toolkit{'\n'}
                ✓ Actions synchrones et asynchrones{'\n'}
                ✓ Sélecteurs mémoïsés{'\n'}
                ✓ Redux Persist intégré{'\n'}
                ✓ TypeScript strict
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Fonctionnalités TP2</Text>
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
                  href={`/detail/${item.id}` as any}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 TP3 - Formulaires Avancés</Text>
          <Text style={styles.description}>
            Comparez deux approches modernes pour la gestion des formulaires en React Native :
          </Text>
          
          <View style={styles.formsContainer}>
            <Link href="/TP3-forms/formik" asChild>
              <TouchableOpacity style={[styles.formCard, styles.formikCard]}>
                <Text style={styles.formCardTitle}>🟣 Formik + Yup</Text>
                <Text style={styles.formCardDescription}>
                  Approche traditionnelle et éprouvée pour la gestion des formulaires
                </Text>
                <Text style={styles.formCardFeatures}>
                  • API intuitive • Écosystème riche • Documentation complète
                </Text>
              </TouchableOpacity>
            </Link>

            <Link href="/TP3-forms/rhf" asChild>
              <TouchableOpacity style={[styles.formCard, styles.rhfCard]}>
                <Text style={styles.formCardTitle}>🟢 React Hook Form + Zod</Text>
                <Text style={styles.formCardDescription}>
                  Approche moderne et performante avec validation TypeScript
                </Text>
                <Text style={styles.formCardFeatures}>
                  • Performance optimisée • TypeScript natif • Bundle size réduit
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
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
    ...shadows.medium,
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
  formsContainer: {
    gap: 16,
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 2,
    ...shadows.medium,
  },
  formikCard: {
    borderColor: '#8B5CF6',
  },
  rhfCard: {
    borderColor: '#10B981',
  },
  zustandCard: {
    borderColor: '#F59E0B',
  },
  reduxCard: {
    borderColor: '#10B981', // Vert pour Redux (TP4B)
  },
  formCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  formCardDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  formCardFeatures: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 16,
  },
});