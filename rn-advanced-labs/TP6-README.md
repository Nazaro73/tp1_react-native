# TP6 — Caméra (Expo) : capture, stockage local & galerie

## 📱 Description du projet

Application mobile complète de capture et gestion de photos avec :
- **Capture photo** via `expo-camera` avec prévisualisation temps réel
- **Stockage local** des photos avec `expo-file-system`
- **Galerie responsive** en grille avec miniatures
- **Écran détail** avec métadonnées, suppression et partage
- **Gestion robuste des permissions** avec UI claire

---

## 🎯 Objectifs pédagogiques atteints

✅ Gestion complète des **permissions caméra** (iOS + Android)
✅ Utilisation d'**`expo-camera`** pour prévisualiser et capturer des photos
✅ Stockage local avec **`expo-file-system`** dans le DocumentDirectory
✅ Architecture propre avec **séparation des responsabilités** (services, hooks, UI)
✅ **Galerie interactive** avec grille responsive et pull-to-refresh
✅ **Écran détail** avec métadonnées, suppression et partage
✅ Navigation fluide avec **Expo Router**

---

## 📦 Dépendances

### Packages installés

```json
{
  "expo-camera": "^16.0.0",
  "expo-file-system": "^18.0.0"
}
```

### Rôle de chaque package

1. **`expo-camera`**
   - **Rôle** : Accès à la caméra du device (avant/arrière)
   - **Usage** : Prévisualisation temps réel, capture de photos, basculement caméra avant/arrière
   - **Features** : API unifiée iOS/Android, gestion permissions, contrôle qualité

2. **`expo-file-system`**
   - **Rôle** : Manipulation du système de fichiers local
   - **Usage** : Enregistrement, lecture, suppression de fichiers photos
   - **Features** : Accès DocumentDirectory, gestion dossiers, métadonnées fichiers
   - **⚠️ Important** : Ce projet utilise la **nouvelle API moderne (v54+)** avec les classes `File` et `Directory` au lieu de l'ancienne API dépréciée (`getInfoAsync`, `makeDirectoryAsync`, etc.)

---

## 🏗️ Architecture du projet

### Arborescence

```
rn-advanced-labs/
├── app/(main)/TP6-camera/
│   ├── index.tsx           # 🖼️ Galerie (grille de miniatures)
│   ├── camera.tsx          # 📷 Écran de prise de vue
│   └── detail/[id].tsx     # 🔍 Écran détail d'une photo
│
├── lib/
│   ├── camera/
│   │   ├── types.ts        # 🔷 Types TypeScript (Photo, PhotoMetadata)
│   │   └── storage.ts      # 💾 Service de stockage (CRUD photos)
│   │
│   └── hooks/
│       ├── useCameraPermission.ts   # 🔐 Hook gestion permissions
│       └── usePhotoStorage.ts       # 📦 Hook stateful pour le storage
│
└── app.json                # ⚙️ Config permissions iOS/Android
```

### Routes Expo Router

| Route | Description |
|-------|-------------|
| `/TP6-camera` | Galerie (liste des photos) |
| `/TP6-camera/camera` | Écran de capture photo |
| `/TP6-camera/detail/[id]` | Détail d'une photo avec actions |

---

## 🔐 Gestion des permissions

### Déclaration (app.json)

**iOS** — `infoPlist.NSCameraUsageDescription`
```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app needs access to your camera to take photos for the gallery."
    }
  }
}
```

**Android** — Permissions + Plugin expo-camera
```json
{
  "android": {
    "permissions": ["CAMERA"]
  },
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera to take photos."
      }
    ]
  ]
}
```

### Runtime (useCameraPermission.ts)

```typescript
export function useCameraPermission(): CameraPermissionState {
  // 1. Vérifier le statut actuel
  const { status } = await Camera.getCameraPermissionsAsync();

  // 2. Demander permission si nécessaire
  const { status } = await Camera.requestCameraPermissionsAsync();

  // 3. Gérer le refus avec UI claire
  if (status === 'denied') {
    Alert.alert('Permission Required', '...', [
      { text: 'Open Settings', onPress: openSettings }
    ]);
  }
}
```

### Workflow permissions

1. **Au chargement de l'écran Caméra** : vérification automatique
2. **Si `undetermined`** : demande de permission
3. **Si `denied`** : affichage UI explicite + bouton "Ouvrir les réglages"
4. **Si `granted`** : affichage de la caméra

---

## 🎬 Flux de l'application

### 1️⃣ Galerie (`/TP6-camera`)

```
[Chargement] → Scan dossier photos/ → Affichage grille
                                         ↓
                                   [3 colonnes responsive]
                                         ↓
                              Tap miniature → Détail
                              Bouton FAB → Caméra
                              Pull-to-refresh → Rescan
```

**Features** :
- ✅ Grille responsive (3 colonnes)
- ✅ Pull-to-refresh pour rescanner
- ✅ État vide avec message explicite
- ✅ Compteur de photos dans le header
- ✅ FAB (Floating Action Button) pour ouvrir la caméra

---

### 2️⃣ Caméra (`/TP6-camera/camera`)

```
[Entrée écran] → Vérif permission → [Denied] → UI explicite + Settings
                       ↓
                  [Granted]
                       ↓
              Prévisualisation temps réel
                       ↓
         [Bouton capture] → takePictureAsync()
                       ↓
              Enregistrement local (storage.ts)
                       ↓
         Alert succès → Navigation → Galerie
```

**Features** :
- ✅ Prévisualisation temps réel (back camera par défaut)
- ✅ Bouton flip caméra (avant/arrière)
- ✅ Bouton capture avec feedback visuel
- ✅ Sauvegarde automatique dans `photos/`
- ✅ Retour automatique à la galerie avec message succès

---

### 3️⃣ Détail (`/TP6-camera/detail/[id]`)

```
[Chargement] → getPhoto(id) → Affichage full-screen
                                      ↓
                        ┌──────────────┼──────────────┐
                        ↓              ↓              ↓
                   Métadonnées     Bouton Share  Bouton Delete
                   (date, size)                      ↓
                                            Confirmation Alert
                                                     ↓
                                           deletePhoto(id)
                                                     ↓
                                           Retour Galerie
```

**Features** :
- ✅ Image plein écran (contain)
- ✅ Métadonnées : Date, Taille fichier, ID
- ✅ Bouton **Partager** (Share API native)
- ✅ Bouton **Supprimer** avec confirmation
- ✅ Suppression physique du fichier
- ✅ Retour automatique à la galerie après suppression

---

## 💾 Service de stockage (`storage.ts`)

### API publique

```typescript
// Assurer que le dossier existe
await ensureDir();

// Sauvegarder une photo
const photo = await savePhoto(tempUri);
// → { id, uri, createdAt, size }

// Lister toutes les photos (triées par date)
const photos = await listPhotos();
// → Photo[]

// Récupérer une photo par ID
const photo = await getPhoto('photo_1234567890');
// → Photo | null

// Supprimer une photo
const success = await deletePhoto('photo_1234567890');
// → boolean

// Utilitaires
formatFileSize(12345); // "12.06 KB"
formatDate(1234567890); // "13/02/2009 à 23:31:30"
```

### Migration vers la nouvelle API (v54+)

Le service utilise la **nouvelle API moderne** d'`expo-file-system` :

```typescript
// ✅ NOUVELLE API (utilisée dans ce projet)
import { documentDirectory, File, Directory } from 'expo-file-system';

const dir = new Directory(`${documentDirectory}photos/`);
await dir.exists();
await dir.create();
await dir.list();

const file = new File(filePath);
await file.exists();
await file.size();
await file.delete();
await sourceFile.copy(destFile);

// ❌ ANCIENNE API (dépréciée depuis v54)
import * as FileSystem from 'expo-file-system';

await FileSystem.getInfoAsync(path);
await FileSystem.makeDirectoryAsync(path);
await FileSystem.readDirectoryAsync(path);
await FileSystem.deleteAsync(path);
await FileSystem.copyAsync({ from, to });
```

### Détails d'implémentation

**Dossier de stockage** : `${documentDirectory}photos/`

**Naming des fichiers** : `photo_<timestamp>.jpg`
- Exemple : `photo_1707836400000.jpg`
- Le timestamp sert d'ID unique

**Métadonnées extraites** :
- `id` : nom du fichier sans extension
- `uri` : chemin complet du fichier
- `createdAt` : timestamp de création (extrait du nom)
- `size` : taille en bytes (via `getInfoAsync()`)

**Gestion des erreurs** :
- Try/catch sur toutes les opérations I/O
- Logs détaillés en console
- Throw d'erreurs explicites pour l'UI

---

## 🧪 Tests manuels effectués

### ✅ Test 1 : Permissions

**Scénario** : Refuser la permission caméra

**Étapes** :
1. Lancer l'app
2. Naviguer vers `/TP6-camera/camera`
3. Refuser la permission

**Résultat attendu** :
- ✅ UI explicite avec icône caméra
- ✅ Message clair "Camera Access Required"
- ✅ Bouton "Open Settings" fonctionnel
- ✅ Bouton "Go Back" pour retourner à la galerie

**Résultat obtenu** : ✅ **PASS**

---

**Scénario** : Accepter la permission caméra

**Étapes** :
1. Réinstaller l'app (reset permissions)
2. Naviguer vers `/TP6-camera/camera`
3. Accepter la permission

**Résultat attendu** :
- ✅ Prévisualisation caméra immédiate
- ✅ Boutons fonctionnels (capture, flip)

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 2 : Capture et stockage

**Scénario** : Prendre 2 photos et vérifier la galerie

**Étapes** :
1. Ouvrir la caméra
2. Capturer photo 1
3. Attendre le retour à la galerie
4. Vérifier la miniature
5. Reprendre la caméra
6. Capturer photo 2
7. Vérifier les 2 miniatures

**Résultat attendu** :
- ✅ Alert "Success" après chaque capture
- ✅ Retour automatique à la galerie
- ✅ 2 miniatures visibles dans la grille
- ✅ Compteur "2 photos" dans le header

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 3 : Détail d'une photo

**Scénario** : Afficher les métadonnées d'une photo

**Étapes** :
1. Depuis la galerie, tap sur une miniature
2. Observer l'écran détail

**Résultat attendu** :
- ✅ Image affichée plein écran
- ✅ Métadonnées visibles :
  - Date et heure de création
  - Taille du fichier (ex: "234.56 KB")
  - ID de la photo
- ✅ Boutons "Share" et "Delete" présents

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 4 : Suppression

**Scénario** : Supprimer une photo

**Étapes** :
1. Ouvrir le détail d'une photo
2. Tap sur "Delete"
3. Confirmer la suppression
4. Observer le retour à la galerie

**Résultat attendu** :
- ✅ Alert de confirmation "Are you sure?"
- ✅ Suppression après confirmation
- ✅ Alert "Success" de feedback
- ✅ Retour automatique à la galerie
- ✅ Miniature disparue de la grille
- ✅ Compteur mis à jour ("1 photo" → "0 photos")

**Résultat obtenu** : ✅ **PASS**

---

**Scénario** : Vérifier que le fichier n'existe plus

**Étapes** :
1. Après suppression, relancer l'app
2. Aller dans la galerie

**Résultat attendu** :
- ✅ La photo supprimée n'apparaît plus
- ✅ Le fichier physique a été supprimé du disque

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 5 : Persistance

**Scénario** : Vérifier la persistance après redémarrage

**Étapes** :
1. Prendre 3 photos
2. Fermer complètement l'app (force quit)
3. Relancer l'app
4. Naviguer vers la galerie

**Résultat attendu** :
- ✅ Les 3 photos sont toujours présentes
- ✅ Miniatures chargées correctement
- ✅ Compteur affiche "3 photos"

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 6 : Partage (optionnel)

**Scénario** : Partager une photo

**Étapes** :
1. Ouvrir le détail d'une photo
2. Tap sur "Share"
3. Sélectionner une app (Messages, Mail, etc.)

**Résultat attendu** :
- ✅ Sheet native de partage iOS/Android
- ✅ Photo attachée au message/email

**Résultat obtenu** : ✅ **PASS**

---

### ✅ Test 7 : UI/UX

**Scénario** : Vérifier l'expérience utilisateur

**Checks** :
- ✅ **Galerie vide** : Message explicite + icône + bouton FAB visible
- ✅ **Pull-to-refresh** : Fonctionne et rescanne le dossier
- ✅ **Responsive** : Grille s'adapte à la largeur d'écran
- ✅ **Loading states** : Spinners pendant chargement
- ✅ **Error handling** : Messages d'erreur clairs si échec I/O
- ✅ **Accessibilité** : Labels sur tous les boutons

**Résultat obtenu** : ✅ **PASS**

---

## 📸 Captures d'écran

### 1. Galerie (vide)
![Galerie vide](./screenshots/tp6-gallery-empty.png)
- État initial avec message explicite
- FAB pour ouvrir la caméra

### 2. Permission caméra (denied)
![Permission denied](./screenshots/tp6-permission-denied.png)
- UI claire en cas de refus
- Boutons "Open Settings" et "Go Back"

### 3. Caméra (prévisualisation)
![Caméra](./screenshots/tp6-camera-preview.png)
- Prévisualisation temps réel
- Boutons capture et flip

### 4. Galerie (avec photos)
![Galerie avec photos](./screenshots/tp6-gallery-filled.png)
- Grille responsive 3 colonnes
- Compteur de photos dans le header

### 5. Détail d'une photo
![Détail photo](./screenshots/tp6-detail.png)
- Image plein écran
- Métadonnées (date, taille, ID)
- Boutons Share et Delete

---

## 🎨 Points forts de l'architecture

### ✅ Séparation des responsabilités

- **`storage.ts`** : Logique pure de manipulation fichiers (aucun import React/RN)
- **Hooks** : Couche intermédiaire stateful (gestion erreurs, loading)
- **Screens** : UI pure, consomme les services via hooks

### ✅ Pas de chemins en dur dans l'UI

- Tous les chemins gérés dans `storage.ts`
- Fonction `getPhotosDirectory()` pour l'inspection

### ✅ Gestion d'erreurs robuste

- Try/catch sur toutes les opérations I/O
- Messages utilisateur clairs
- Logs détaillés en console pour debug

### ✅ TypeScript strict

- Types explicites partout (`Photo`, `PermissionStatus`, etc.)
- Pas de `any`
- Autocomplétion et safety

### ✅ Performance

- Liste de photos triée côté service
- Miniatures chargées avec `resizeMode="cover"`
- Pull-to-refresh au lieu de polling

---

## 🚀 Améliorations possibles (hors scope)

### 🔜 Features bonus (non implémentées)

1. **Zoom/Pinch** sur la photo en détail
2. **Renommer une photo** (édition ID)
3. **Enregistrer dans la galerie système** (via `expo-media-library`)
4. **Filtres/Édition** (expo-image-manipulator)
5. **Upload cloud** (Firebase Storage, S3, etc.)
6. **Recherche/Tags** sur les photos
7. **Animations** (transition galerie → détail)
8. **Mode sombre** (respect `useColorScheme`)

### 🔧 Optimisations techniques

1. **Compression** : Réduire la qualité/taille avant sauvegarde
2. **Thumbnails** : Générer des miniatures dédiées (gain perf)
3. **Virtualized list** : FlashList au lieu de FlatList (grandes galeries)
4. **Lazy loading** : Charger images par batch
5. **Cache** : Mettre en cache les métadonnées (JSON adjacent)

---

## 🛠️ Instructions d'installation

### Prérequis

- Node.js 18+
- Expo CLI installé (`npm install -g expo-cli`)
- Device physique OU émulateur avec support caméra

### Installation

```bash
# Cloner le repo
git clone <repo-url>
cd rn-advanced-labs

# Installer les dépendances
npm install

# Lancer l'app
npx expo start
```

### Rebuild natif (si nécessaire)

Si les permissions ne fonctionnent pas :

```bash
# iOS
npx expo prebuild -p ios
npx expo run:ios

# Android
npx expo prebuild -p android
npx expo run:android
```

---

## 🔄 Rafraîchissement automatique

### Feature clé : `useFocusEffect`

La galerie utilise `useFocusEffect` d'Expo Router pour **se rafraîchir automatiquement** à chaque fois que l'écran devient visible :

```typescript
import { useFocusEffect } from 'expo-router';

useFocusEffect(
  useCallback(() => {
    console.log('[Gallery] Screen focused - refreshing photos');
    refreshPhotos();
  }, [refreshPhotos])
);
```

**Avantages** :
- ✅ Photo visible **immédiatement** après capture (pas besoin de quitter/rouvrir)
- ✅ Liste à jour après suppression
- ✅ Pas d'Alert bloquante
- ✅ UX fluide et naturelle

**Flux** :
1. Capture photo → Sauvegarde → Retour galerie
2. `useFocusEffect` détecte le focus
3. `refreshPhotos()` recharge la liste
4. Nouvelle photo visible instantanément ✨

---

## 📝 Notes importantes

### ⚠️ Limitations

1. **Pas de galerie système** : Les photos restent dans l'app (DocumentDirectory)
2. **Émulateur iOS** : La caméra simule une image noire (tester sur device réel)
3. **Web** : `expo-camera` ne fonctionne pas sur web (mobile uniquement)

### 💡 Conseils pour les tests

- **Tester sur device réel** pour l'expérience complète
- **Tester le refus de permission** : Désinstaller/réinstaller l'app
- **Vérifier le stockage** : Console logs affichent les chemins complets
- **Forcer refresh** : Pull-to-refresh dans la galerie après modifications manuelles

---

## 🔗 Liens utiles

- [Expo Camera Docs](https://docs.expo.dev/versions/latest/sdk/camera/)
- [Expo FileSystem Docs](https://docs.expo.dev/versions/latest/sdk/filesystem/)
- [Expo Router - Dynamic Routes](https://docs.expo.dev/router/introduction/)
- [React Native Share API](https://reactnative.dev/docs/share)

---

## ✅ Checklist de livraison

- ✅ Installation des dépendances (`expo-camera`, `expo-file-system`)
- ✅ Permissions déclarées dans `app.json` (iOS + Android)
- ✅ Service de stockage complet (`storage.ts`)
- ✅ Hook de permissions (`useCameraPermission.ts`)
- ✅ Hook de storage stateful (`usePhotoStorage.ts`)
- ✅ Écran Caméra avec capture et flip
- ✅ Écran Galerie avec grille responsive
- ✅ Écran Détail avec métadonnées et actions
- ✅ Navigation Expo Router fonctionnelle
- ✅ Point d'entrée depuis le menu principal
- ✅ Gestion d'erreurs robuste
- ✅ Tests manuels effectués et documentés
- ✅ README complet avec architecture et tests
- ✅ Captures d'écran (ou instructions pour les générer)

---

## 🎓 Conclusion

Ce TP6 démontre une **implémentation professionnelle** d'une application de capture et gestion de photos avec :

- ✅ **Architecture propre** : Services découplés, hooks réutilisables
- ✅ **UX soignée** : Gestion permissions claire, feedback utilisateur, loading states
- ✅ **Code maintenable** : TypeScript strict, séparation responsabilités, gestion erreurs
- ✅ **Performance** : Pas de bottleneck I/O, liste optimisée

L'application est **production-ready** et peut servir de base pour des features avancées (cloud upload, édition, tags, etc.).

---

## 👨‍💻 Auteur

**RN Advanced Labs - TP6**
Réalisé dans le cadre du cours React Native avancé
Date : Janvier 2025
