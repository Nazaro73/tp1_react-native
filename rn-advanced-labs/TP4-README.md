# TP4-A — Zustand : CRUD "Robots" (liste + formulaire + delete)

## 🎯 Objectifs pédagogiques réalisés

✅ **Store global** avec **Zustand** pour gérer une collection de robots  
✅ **CRUD complet** : **Create, Read (liste/détail), Update, Delete**  
✅ **Formulaire** robuste avec **React Hook Form + Zod** et validation  
✅ **Navigation** intégrée (Expo Router) : liste → création/édition → retour  
✅ **Persistance** locale avec AsyncStorage  

---

## 🤖 Modèle Robot & règles métier

### Structure des données
```typescript
interface Robot {
  id: string;           // UUID généré automatiquement
  name: string;         // Nom du robot (min 2 caractères, unique)
  label: string;        // Description (min 3 caractères)
  year: number;         // Année de fabrication (1950 - année courante)
  type: RobotTypeValue; // Type de robot (enum)
}

enum RobotType {
  INDUSTRIAL = 'industrial',
  SERVICE = 'service', 
  MEDICAL = 'medical',
  EDUCATIONAL = 'educational',
  OTHER = 'other'
}
```

### Règles de validation
- **Nom** : 2-50 caractères, unique dans la collection
- **Description** : 3-100 caractères, obligatoire
- **Année** : entier entre 1950 et année courante
- **Type** : sélection obligatoire parmi les 5 types disponibles

---

## 📁 Architecture du projet

```
app/(main)/tp4-robots/
├── index.tsx                 # 📋 Liste des robots + actions
├── create.tsx               # ➕ Écran de création
└── edit/[id].tsx           # ✏️ Écran d'édition (route dynamique)

store/
└── robotsStore.ts          # 🏪 Store Zustand avec persistance

validation/
└── robotSchema.ts          # 🔍 Types & validation Zod

components/
└── RobotForm.tsx           # 📝 Formulaire réutilisable (create/edit)
```

---

## 🏪 Store Zustand - Fonctionnalités

### State managé
```typescript
interface RobotsState {
  robots: Robot[];          // Collection des robots
  selectedId?: string;      // Robot sélectionné (optionnel)
}
```

### Actions CRUD implémentées
- **`create(robotInput)`** : Ajoute un robot (génère ID, vérifie unicité nom)
- **`update(id, robotInput)`** : Met à jour un robot existant
- **`remove(id)`** : Supprime un robot
- **`getById(id)`** : Récupère un robot par son ID
- **`isNameUnique(name, excludeId?)`** : Vérifie l'unicité du nom

### Persistance automatique
- **Middleware `persist`** avec AsyncStorage
- **Restauration** automatique au démarrage
- **Logging** des opérations pour debug

### Optimisations performance
```typescript
// Sélecteurs optimisés pour éviter les re-renders
export const useRobots = () => useRobotsStore(state => state.robots);
export const useRobotById = (id: string) => useRobotsStore(state => state.getById(id));
```

---

## 📝 Formulaire - Stack technique

### Choix : React Hook Form + Zod
**Pourquoi cette stack ?**
- ✅ **Performance optimisée** : moins de re-rendus vs Formik
- ✅ **TypeScript natif** : inférence de types automatique avec Zod  
- ✅ **Validation robuste** : schémas Zod réutilisables et composables
- ✅ **DX excellente** : API moderne avec hooks React
- ✅ **Bundle size réduit** : plus léger que Formik+Yup

### Validation Zod implémentée
```typescript
export const robotValidationSchema = z.object({
  name: z.string().min(2).max(50).trim(),
  label: z.string().min(3).max(100).trim(),
  year: z.number().int().min(1950).max(new Date().getFullYear()),
  type: z.enum(['industrial', 'service', 'medical', 'educational', 'other']),
});
```

### UX Mobile optimisée
- **KeyboardAvoidingView** : évite que le clavier masque les champs
- **Navigation clavier** : `returnKeyType="next"` + focus automatique
- **Validation temps réel** : erreurs affichées pendant la saisie
- **Feedback haptique** : vibrations succès/erreur (iOS/Android)
- **Bouton dynamique** : désactivé tant que le formulaire n'est pas valide

---

## 🎨 Interface utilisateur

### Écran Liste (`/tp4-robots`)
- **Header** : compteur de robots + bouton création
- **Liste** : robots triés par nom avec métadonnées (type, année)
- **Actions par item** : boutons Éditer (✏️) et Supprimer (🗑️)
- **État vide** : illustration + CTA pour créer le premier robot
- **Bouton flottant** : création rapide quand la liste n'est pas vide

### Écran Création (`/tp4-robots/create`)
- **Formulaire** complet avec validation temps réel
- **Picker type** : sélection visuelle par boutons
- **Gestion d'erreur** : unicité du nom vérifiée
- **Navigation** : annulation et retour automatique après création

### Écran Édition (`/tp4-robots/edit/[id]`)
- **Préchargement** : valeurs existantes du robot
- **Validation** : même logique que la création
- **États d'erreur** : robot introuvable, ID manquant
- **Loading overlay** : indicateur pendant la sauvegarde

---

## 🧪 Tests manuels réalisés

### ✅ Create (Création)
**Cas de succès :**
- ✅ Formulaire valide → nouveau robot ajouté à la liste
- ✅ Retour automatique vers la liste après création
- ✅ Feedback haptique + notification de succès

**Cas d'échec :**
- ✅ Nom dupliqué → erreur affichée, pas de création
- ✅ Année invalide (< 1950 ou > année courante) → validation bloque
- ✅ Champs vides → bouton submit désactivé

### ✅ Edit (Édition)
- ✅ Chargement robot existant → formulaire prérempli
- ✅ Modification label/type → sauvegarde → liste mise à jour
- ✅ Navigation back fonctionnelle depuis header

### ✅ Delete (Suppression)
- ✅ Confirmation modale avant suppression
- ✅ Suppression confirmée → item disparaît de la liste
- ✅ Feedback haptique + notification succès

### ✅ Persistance
- ✅ Création de 3 robots → fermeture app → réouverture → robots présents
- ✅ Store restauré automatiquement avec logs console
- ✅ Compteur header correct après restauration

### ✅ UX Mobile
- ✅ Clavier n'obscurcit pas le bouton submit
- ✅ Navigation clavier fonctionnelle (next → next → done)
- ✅ Submit désactivé avec validation temps réel
- ✅ Feedback haptique sur toutes les actions

---

## 🔧 Technologies utilisées

```json
{
  "zustand": "^4.4.7",
  "@react-native-async-storage/async-storage": "1.23.1", 
  "react-native-uuid": "^2.0.1",
  "react-hook-form": "^7.48.2",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4",
  "expo-haptics": "~12.8.1"
}
```

### Stack justifiée
- **Zustand** : Store simple et performant, moins verbeux que Redux
- **AsyncStorage** : Persistance locale native React Native
- **React Hook Form** : Performance et DX supérieures à Formik
- **Zod** : Validation TypeScript-first avec inférence de types
- **Expo Haptics** : Feedback tactile pour améliorer l'UX

---

## 🚀 Fonctionnalités avancées

### Sélecteurs optimisés
```typescript
// Évite les re-renders inutiles
const robots = useRobots();
const robot = useRobotById(id);
const actions = useRobotsActions();
```

### Gestion d'erreurs complète
- **Validation métier** : unicité des noms
- **Validation technique** : types Zod stricts
- **États d'erreur** : loading, not found, network
- **Recovery** : messages clairs + actions possibles

### Performance
- **Lazy loading** : écrans chargés à la demande
- **Optimized re-renders** : sélecteurs Zustand ciblés
- **Validation asynchrone** : uniquement quand nécessaire

---

## 📱 Navigation & Routes

```typescript
// Routes Expo Router implémentées
/tp4-robots           → Liste des robots
/tp4-robots/create    → Création d'un robot  
/tp4-robots/edit/[id] → Édition d'un robot (route dynamique)
```

### Intégration menu principal
Accessible depuis l'écran d'accueil via la carte **"🤖 TP4 - Gestion d'état avec Zustand"**

---

## 🏆 Résultats obtenus

### Critères d'acceptation validés
✅ **Store global** fonctionnel avec actions CRUD  
✅ **Persistance** automatique via AsyncStorage  
✅ **Validation** robuste avec gestion des erreurs  
✅ **UX mobile** optimisée (clavier, haptique, navigation)  
✅ **Architecture** propre et maintenable  
✅ **Performance** optimisée avec sélecteurs ciblés  

### Apprentissages clés
- **Zustand** : simplicité vs Redux, excellent pour des stores moyens
- **Persistance** : middleware Zustand plus simple que redux-persist
- **RHF + Zod** : stack moderne performante pour les formulaires
- **TypeScript** : inférence de types avec Zod très puissante
- **Mobile UX** : importance du feedback haptique et de la navigation clavier

---

## 📸 Captures d'écran

### Liste des robots
- État vide avec CTA de création
- Liste remplie avec actions par item
- Header avec compteur dynamique

### Formulaire de création/édition
- Validation temps réel en action
- Picker de type visuel
- Messages d'erreur contextuels

### Interactions
- Confirmations de suppression
- Feedback de succès/erreur
- Navigation fluide entre écrans

---

*TP4 réalisé avec React Native, Expo Router, Zustand et TypeScript*