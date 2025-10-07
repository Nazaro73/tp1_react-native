/**
 * Home Screen - Menu principal des TPs
 * UI/UX moderne avec cartes colorées distinctes
 */

import { Link } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Configuration des TPs avec couleurs et icônes
const TPS = [
  {
    id: 'tp2',
    title: 'TP2 - Navigation',
    subtitle: 'Deep Linking & Routing',
    description: 'Expo Router, paramètres dynamiques et persistance de navigation',
    icon: 'arrow.triangle.branch',
    route: '/42',
    color: '#3B82F6', // Bleu
    gradient: ['#3B82F6', '#2563EB'],
  },
  {
    id: 'tp3-formik',
    title: 'TP3 - Formik + Yup',
    subtitle: 'Gestion de formulaires',
    description: 'Validation robuste avec Formik et schéma Yup',
    icon: 'doc.text.fill',
    route: '/TP3-forms/formik',
    color: '#8B5CF6', // Violet
    gradient: ['#8B5CF6', '#7C3AED'],
  },
  {
    id: 'tp3-rhf',
    title: 'TP3 - React Hook Form',
    subtitle: 'Gestion de formulaires',
    description: 'Performance optimisée avec RHF et validation Zod',
    icon: 'doc.text.fill',
    route: '/TP3-forms/rhf',
    color: '#10B981', // Vert
    gradient: ['#10B981', '#059669'],
  },
  {
    id: 'tp4-zustand',
    title: 'TP4 - Zustand Store',
    subtitle: 'Gestion d\'état globale',
    description: 'CRUD de robots avec Zustand et persistance AsyncStorage',
    icon: 'cpu.fill',
    route: '/tp4-robots',
    color: '#F59E0B', // Orange
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    id: 'tp4b-redux',
    title: 'TP4B - Redux Toolkit',
    subtitle: 'Gestion d\'état globale',
    description: 'CRUD avec Redux, thunks asynchrones et Redux Persist',
    icon: 'atom',
    route: '/tp4b-robots-rtk',
    color: '#06B6D4', // Cyan
    gradient: ['#06B6D4', '#0891B2'],
  },
  {
    id: 'tp5-sqlite',
    title: 'TP5 - SQLite Database',
    subtitle: 'Stockage local',
    description: 'Base de données locale avec migrations versionnées et export/import',
    icon: 'cylinder.fill',
    route: '/TP5-robots-db',
    color: '#0369A1', // Bleu foncé
    gradient: ['#0369A1', '#075985'],
  },
  {
    id: 'tp6-camera',
    title: 'TP6 - Caméra & Galerie',
    subtitle: 'Capture d\'images',
    description: 'Prise de photos avec expo-camera et galerie locale interactive',
    icon: 'camera.fill',
    route: '/TP6-camera',
    color: '#EC4899', // Rose
    gradient: ['#EC4899', '#DB2777'],
  },
];

export default function HomeScreen() {
  useEffect(() => {
    console.log('✅ [HomeScreen] Component mounted');
    return () => console.log('🔄 [HomeScreen] Component unmounting');
  }, []);

  return (
    <View style={styles.container}>
      {/* Hero Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.heroTitle}>RN Advanced Labs</Text>
          <Text style={styles.heroSubtitle}>Travaux Pratiques React Native</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{TPS.length} TPs disponibles</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Grid de cartes TPs */}
        <View style={styles.grid}>
          {TPS.map((tp, index) => (
            <View key={tp.id} style={styles.cardWrapper}>
              <Link href={tp.route as any} asChild>
                <TouchableOpacity
                  style={[
                    styles.card,
                    {
                      shadowColor: tp.color,
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 20,
                      elevation: 10,
                      borderWidth: 2,
                      borderColor: tp.color + '50',
                    }
                  ]}
                  activeOpacity={0.9}
                  onPress={() => console.log(`🔗 [HomeScreen] Navigation vers ${tp.title}`)}
                >
                  {/* Header de la carte avec gradient */}
                  <View style={[styles.cardHeader, { backgroundColor: tp.color }]}>
                    <View style={styles.cardHeaderContent}>
                      <View style={styles.iconContainer}>
                        <IconSymbol name={tp.icon as any} size={32} color="#fff" />
                      </View>
                      <View style={styles.cardHeaderText}>
                        <Text style={styles.cardNumber}>#{index + 1}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Contenu de la carte */}
                  <View style={styles.cardBody}>
                    <Text style={styles.cardTitle}>{tp.title}</Text>
                    <Text style={styles.cardSubtitle}>{tp.subtitle}</Text>
                    <Text style={styles.cardDescription}>{tp.description}</Text>

                    {/* Bouton Tester */}
                    <View style={[styles.testButton, { backgroundColor: tp.color }]}>
                      <Text style={styles.testButtonText}>Tester</Text>
                      <IconSymbol name="arrow.right" size={16} color="#fff" />
                    </View>
                  </View>

                  {/* Badge de statut */}
                  <View style={[styles.statusBadge, { backgroundColor: tp.color + '20' }]}>
                    <View style={[styles.statusDot, { backgroundColor: tp.color }]} />
                    <Text style={[styles.statusText, { color: tp.color }]}>Disponible</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            React Native • Expo • TypeScript
          </Text>
          <Text style={styles.footerSubtext}>
            Sélectionnez un TP pour commencer
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 20,
    backgroundColor: '#1F2937',
  },
  headerContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    marginBottom: 16,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#1F2937',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#1F2937',
  },
  grid: {
    gap: 20,
  },
  cardWrapper: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    overflow: 'hidden',
  },
  card: {
    
    borderRadius: 18,
    overflow: 'hidden',
    
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopEndRadius: 18,
    borderTopStartRadius: 18,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 26,
    backgroundColor: 'rgba(93, 70, 70, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    alignItems: 'flex-end',
  },
  cardNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    opacity: 0.95,
  },
  cardBody: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    marginTop: 20,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 40,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    gap: 8,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    position: 'absolute',
    top: 70,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 32,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  footerText: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
