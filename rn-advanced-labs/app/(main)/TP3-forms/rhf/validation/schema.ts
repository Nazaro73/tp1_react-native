import { z } from 'zod';

// Schéma de validation Zod
export const registrationSchema = z.object({
  email: z
    .string()
    .min(1, 'L\'email est obligatoire')
    .email('Adresse email invalide'),
  
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre'
    ),
  
  confirmPassword: z.string(),
  
  displayName: z
    .string()
    .min(2, 'Le nom d\'affichage doit contenir au moins 2 caractères')
    .max(50, 'Le nom d\'affichage ne peut pas dépasser 50 caractères'),
  
  termsAccepted: z
    .boolean()
    .refine((val) => val === true, {
      message: 'Vous devez accepter les conditions d\'utilisation'
    })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword']
});

// Type inféré du schéma
export type FormValues = z.infer<typeof registrationSchema>;

// Valeurs par défaut
export const defaultValues: FormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  displayName: '',
  termsAccepted: false
};