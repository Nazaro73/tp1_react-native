# TP4-B — Redux Toolkit : CRUD "Robots"

## 📁 Structure du projet

```
rn-advanced-labs/
├── app/
│   ├── (main)/
│   │   └── tp4b-robots-rtk/        # 🟢 Écrans TP4B
│   │       ├── index.tsx            # Liste des robots
│   │       ├── create.tsx           # Création
│   │       └── edit/
│   │           └── [id].tsx         # Édition
│   ├── redux/                       # 🟢 Configuration Redux
│   │   ├── store.ts                 # Store + redux-persist
│   │   ├── hooks.ts                 # Hooks typés
│   │   └── rootReducer.ts           # Combinaison des reducers
│   └── _layout.tsx                  # Provider Redux + PersistGate
├── features/
│   └── robots/                      # 🟢 Logique métier Redux
│       ├── robotsSlice.ts           # Slice + thunks asynchrones
│       └── selectors.ts             # Sélecteurs mémoïsés
├── validation/
│   └── robotSchema.ts               # Schéma de validation Zod
└── global.d.ts                      # Déclarations TypeScript

```

## 🎯 Architecture Redux Toolkit

### 1️⃣ **Store Configuration** (`app/redux/store.ts`)
- ✅ `configureStore` avec `redux-persist`
- ✅ AsyncStorage pour la persistance
- ✅ Whitelist `robots` uniquement
- ✅ Middleware avec `serializableCheck` configuré
- ✅ DevTools en mode développement

### 2️⃣ **Slice Redux** (`features/robots/robotsSlice.ts`)
- ✅ **Reducers synchrones** : `createRobot`, `updateRobot`, `deleteRobot`
- ✅ **Thunks asynchrones** : `saveRobotAsync`, `deleteRobotAsync`, `loadRobots`
- ✅ **Validation d'unicité** du nom (insensible à la casse)
- ✅ **États de chargement** : `isLoading`, `error`
- ✅ **Tri automatique** par nom

### 3️⃣ **Selectors** (`features/robots/selectors.ts`)
- ✅ `selectRobots` : Liste complète
- ✅ `selectRobotById(id)` : Robot par ID
- ✅ `selectRobotsSortedByName` : Tri mémoïsé avec `createSelector`
- ✅ `selectRobotsStats` : Statistiques (total, par type, années)
- ✅ `selectRobotsUIState` : État de l'UI (loading, error, empty)

### 4️⃣ **Hooks typés** (`app/redux/hooks.ts`)
- ✅ `useAppDispatch` : Dispatch typé
- ✅ `useAppSelector` : Sélecteur typé
- ✅ `useRobotsActions` : Wrapper avec gestion d'erreur

## 🎨 Thème & Design

### Couleurs principales
- **Vert principal** : `#10B981`
- **Vert clair** : `#D1FAE5` (badges)
- **Fond** : `#F9FAFB`
- **Cartes** : `#FFFFFF`
- **Bordures** : `#E5E7EB`
- **Texte** : `#1F2937`
- **Danger** : `#ef4444`

### Style inspiré du TP4A
- Cards horizontales avec ombre
- Bouton FAB vert flottant
- Design épuré et moderne
- Formulaires avec validation en temps réel

## ✅ Validation des champs

### Règles implémentées
1. **Nom** : min 2 caractères, **unique**, requis
2. **Label** : min 3 caractères, requis
3. **Année** : entier entre 1950 et année courante
4. **Type** : enum (`industrial | service | medical | educational | other`)

### UX de validation
- ✅ Messages d'aide sous chaque champ
- ✅ Effacement automatique des erreurs à la saisie
- ✅ Bordure rouge sur champs invalides
- ✅ Placeholders visibles (`#9CA3AF`)
- ✅ Validation côté Redux (thunk) pour l'unicité

## 🚀 Fonctionnalités

### CRUD complet
- ✅ **Create** : Formulaire avec validation + thunk async
- ✅ **Read** : Liste triée avec RefreshControl
- ✅ **Update** : Formulaire pré-rempli + thunk async
- ✅ **Delete** : Confirmation + thunk async

### Bonus
- ✅ **Thunks asynchrones** avec simulation de délai (500ms)
- ✅ **États de chargement** pendant les opérations
- ✅ **Messages d'erreur** contextuels
- ✅ **Persistance** avec `redux-persist`
- ✅ **Selectors mémoïsés** pour optimisation

## 📱 Routes

- `/tp4b-robots-rtk` → Liste
- `/tp4b-robots-rtk/create` → Création
- `/tp4b-robots-rtk/edit/[id]` → Édition

## 🔧 Technologies utilisées

- **@reduxjs/toolkit** : ^2.9.0
- **react-redux** : ^9.2.0
- **redux-persist** : ^6.0.0
- **@react-native-async-storage/async-storage** : ^2.2.0
- **zod** : ^3.25.76 (validation)
- **react-native-uuid** : ^2.0.3

## 📊 Comparaison TP4A vs TP4B

| Critère | TP4A (Zustand) | TP4B (Redux Toolkit) |
|---------|----------------|----------------------|
| **Store** | Simple objet | Store configuré |
| **Actions** | Fonctions directes | Reducers + Thunks |
| **State** | Mutable (Immer) | Immer intégré |
| **DevTools** | Extension | Intégré |
| **Persistance** | Middleware Zustand | redux-persist |
| **Selectors** | Hooks simples | createSelector |
| **Async** | Fonctions async | createAsyncThunk |
| **Complexité** | ⭐⭐ | ⭐⭐⭐⭐ |
| **Boilerplate** | Minimal | Moyen |
| **TypeScript** | Simple | Strict |

## ✅ Tests manuels effectués

- ✅ **Create** : Création avec validation
- ✅ **Create (erreur)** : Nom dupliqué refusé
- ✅ **Edit** : Modification avec validation
- ✅ **Delete** : Suppression avec confirmation
- ✅ **Persistance** : Données conservées après redémarrage
- ✅ **Loading states** : Spinners visibles pendant opérations
- ✅ **Error handling** : Messages d'erreur affichés

## 🎓 Points pédagogiques

### Redux Toolkit apporte :
1. **Structure claire** : Slices, reducers, thunks séparés
2. **Immutabilité automatique** : Immer intégré
3. **DevTools puissants** : Time-travel debugging
4. **Selectors optimisés** : Mémoïsation avec `createSelector`
5. **TypeScript strict** : Types inférés automatiquement
6. **Middleware intégré** : Gestion des actions async

### Cas d'usage idéal
- ✅ Applications complexes avec beaucoup d'état
- ✅ Équipes ayant besoin de structure stricte
- ✅ Debugging avancé nécessaire
- ✅ État partagé entre de nombreux composants

---

**Auteur** : Abdel
**Date** : Octobre 2025
**Cours** : React Native - MBA
**Version** : TP4B - Redux Toolkit
