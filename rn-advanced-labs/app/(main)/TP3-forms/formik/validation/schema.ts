import * as Yup from 'yup';

// Types pour le formulaire
export interface FormValues {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
  termsAccepted: boolean;
}

// Schéma de validation Yup
export const registrationSchema = Yup.object({
  email: Yup.string()
    .email('Adresse email invalide')
    .required('L\'email est obligatoire'),
  
  password: Yup.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    )
    .required('Le mot de passe est obligatoire'),
  
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne correspondent pas')
    .required('La confirmation du mot de passe est obligatoire'),
  
  displayName: Yup.string()
    .min(2, 'Le nom d\'affichage doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'affichage ne peut pas dépasser 50 caractères')
    .required('Le nom d\'affichage est obligatoire'),
  
  termsAccepted: Yup.boolean()
    .oneOf([true], 'Vous devez accepter les conditions d\'utilisation')
    .required('Vous devez accepter les conditions d\'utilisation')
});

// Valeurs initiales du formulaire
export const initialValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  termsAccepted: false
};