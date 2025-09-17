# TP3 - Gestion des formulaires avancée en React Native

## 📝 Objectif
Comparer deux approches populaires pour la gestion des formulaires en React Native :
- **Formik + Yup** : approche traditionnelle et éprouvée
- **React Hook Form + Zod** : approche moderne et performante

## 🏗️ Structure du projet

```
app/(main)/TP3-forms/
├── formik/                     # Implémentation Formik + Yup
│   ├── index.tsx              # Écran principal du formulaire
│   ├── components/
│   │   ├── FormField.tsx      # Composant de champ réutilisable
│   │   └── CheckboxField.tsx  # Composant checkbox réutilisable
│   └── validation/
│       └── schema.ts          # Schéma de validation Yup
└── rhf/                       # Implémentation React Hook Form + Zod
    ├── index.tsx              # Écran principal du formulaire
    ├── components/
    │   ├── ControlledTextInput.tsx  # Composant contrôlé pour les inputs
    │   └── ControlledCheckbox.tsx   # Composant contrôlé pour les checkboxes
    └── validation/
        └── schema.ts          # Schéma de validation Zod
```

## 🔗 Navigation

Depuis l'écran d'accueil (`app/(main)/home.tsx`), vous pouvez accéder aux deux implémentations :
- **Formik + Yup** : `/TP3-forms/formik`
- **React Hook Form + Zod** : `/TP3-forms/rhf`

Chaque écran inclut un bouton pour basculer rapidement vers l'autre implémentation.

## ✨ Fonctionnalités implémentées

### Formulaire d'inscription commun
- **Email** : validation du format email
- **Mot de passe** : validation de la complexité (min 8 caractères, majuscule, minuscule, chiffre, caractère spécial)
- **Confirmation de mot de passe** : vérification de la correspondance
- **Nom d'affichage** : validation de la longueur (min 2 caractères)
- **Conditions d'utilisation** : acceptation obligatoire

### UX avancée
- **Navigation au clavier** : passage automatique au champ suivant avec `returnKeyType`
- **Gestion du focus** : focus automatique sur les champs avec refs
- **KeyboardAvoidingView** : adaptation de l'interface lors de l'affichage du clavier
- **Feedback haptique** : vibrations lors de la soumission (succès/erreur)
- **Validation en temps réel** : affichage des erreurs pendant la saisie
- **Bouton dynamique** : activation/désactivation selon la validité du formulaire

## 📊 Comparaison des approches

### Formik + Yup

#### ✅ Avantages
- **Maturité** : bibliothèque établie et largement adoptée
- **Documentation complète** : ressources abondantes et exemples
- **Écosystème riche** : nombreux plugins et intégrations
- **API intuitive** : syntaxe familière pour les développeurs React

#### ❌ Inconvénients
- **Performance** : re-rendus fréquents sur les changements de valeurs
- **Bundle size** : taille plus importante
- **Configuration verbale** : plus de code pour les cas complexes

#### 🔧 Implémentation
```typescript
// Validation Yup
const registrationSchema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  password: yup.string()
    .min(8, 'Minimum 8 caractères')
    .matches(/[A-Z]/, 'Au moins une majuscule')
    .required('Mot de passe requis'),
  // ...
});

// Composant Formik
<Formik
  initialValues={initialValues}
  validationSchema={registrationSchema}
  onSubmit={handleSubmit}
>
  {({ handleSubmit, isValid, isSubmitting }) => (
    // Form content
  )}
</Formik>
```

### React Hook Form + Zod

#### ✅ Avantages
- **Performance optimisée** : re-rendus minimaux grâce aux refs non contrôlées
- **TypeScript natif** : inférence de types automatique avec Zod
- **API moderne** : utilisation des hooks React
- **Bundle size réduit** : plus léger que Formik

#### ❌ Inconvénients
- **Courbe d'apprentissage** : approche différente des formulaires contrôlés
- **Écosystème plus récent** : moins de ressources communautaires
- **Debugging** : plus complexe à déboguer (pas de re-rendus)

#### 🔧 Implémentation
```typescript
// Validation Zod
const registrationSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Au moins une majuscule'),
  // ...
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

// Hook Form
const { control, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
  resolver: zodResolver(registrationSchema),
  defaultValues,
  mode: 'onChange',
});
```

## 📈 Métriques de performance

Les deux implémentations incluent des logs de performance pour analyser :
- **Re-rendus des composants** : fréquence des mises à jour
- **Validation** : temps de traitement des règles
- **État du formulaire** : évolution de la validité

```javascript
// Logs dans la console
console.log('🔄 [Formik] FormikScreen re-rendered');
console.log('🔄 [RHF] RHFFormScreen re-rendered');
console.log('📊 [Formik] Form submitted with values:', values);
console.log('📊 [RHF] Form submitted with values:', data);
```

## 🛠️ Dépendances

```json
{
  "formik": "^2.4.5",
  "yup": "^1.4.0",
  "react-hook-form": "^7.48.2",
  "@hookform/resolvers": "^3.3.2",
  "zod": "^3.22.4",
  "expo-haptics": "~12.8.1"
}
```

## 🚀 Installation et utilisation

1. **Installation des dépendances** :
```bash
npm install formik yup react-hook-form @hookform/resolvers zod expo-haptics
```

2. **Navigation** :
   - Lancez l'application
   - Accédez à l'écran d'accueil
   - Sélectionnez l'implémentation à tester

3. **Test des fonctionnalités** :
   - Testez la validation en temps réel
   - Vérifiez la navigation au clavier
   - Observez les logs de performance dans la console
   - Comparez l'expérience utilisateur entre les deux approches

## 🎯 Recommandations

### Choisir Formik + Yup si :
- Équipe habituée à cette stack
- Projet nécessitant de nombreuses intégrations tierces
- Formulaires simples à modérément complexes
- Besoin de stabilité et de maturité

### Choisir React Hook Form + Zod si :
- Performance critique (formulaires complexes avec de nombreux champs)
- Projet TypeScript avec typage strict
- Équipe à l'aise avec les hooks modernes
- Optimisation du bundle size importante

## 🔍 Points d'observation

Lors de vos tests, observez :
1. **Réactivité** : vitesse de réponse lors de la saisie
2. **Validation** : affichage des erreurs et performance
3. **Navigation** : fluidité du passage entre les champs
4. **Feedback** : clarté des messages d'erreur
5. **Code** : lisibilité et maintenabilité du code source

## 📚 Ressources utiles

- [Documentation Formik](https://formik.org/docs/overview)
- [Documentation Yup](https://github.com/jquense/yup)
- [Documentation React Hook Form](https://react-hook-form.com/)
- [Documentation Zod](https://zod.dev/)
- [Comparaison performance React Hook Form](https://react-hook-form.com/advanced-usage#PerformanceOptimization)