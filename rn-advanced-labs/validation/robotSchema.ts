import { z } from 'zod';

// Enum pour le type de robot
export const RobotType = {
  INDUSTRIAL: 'industrial',
  SERVICE: 'service',
  MEDICAL: 'medical',
  EDUCATIONAL: 'educational',
  OTHER: 'other',
} as const;

export type RobotTypeValue = typeof RobotType[keyof typeof RobotType];

// Interface Robot (avec timestamps pour TP5)
export interface Robot {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotTypeValue;
  created_at?: number;    // TP5: timestamp Unix
  updated_at?: number;    // TP5: timestamp Unix
  archived?: boolean;     // TP5: soft delete
}

// Input pour création/édition (sans id)
export interface RobotInput {
  name: string;
  label: string;
  year: number;
  type: RobotTypeValue;
}

// Schéma de validation Zod
export const robotValidationSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  label: z
    .string()
    .min(3, 'Le label doit contenir au moins 3 caractères')
    .max(100, 'Le label ne peut pas dépasser 100 caractères')
    .trim(),
  year: z
    .number({
      required_error: 'L\'année est obligatoire',
      invalid_type_error: 'L\'année doit être un nombre'
    })
    .int('L\'année doit être un nombre entier')
    .min(1950, 'L\'année doit être supérieure ou égale à 1950')
    .max(new Date().getFullYear(), `L'année ne peut pas dépasser ${new Date().getFullYear()}`),
  type: z.enum(
    [RobotType.INDUSTRIAL, RobotType.SERVICE, RobotType.MEDICAL, RobotType.EDUCATIONAL, RobotType.OTHER],
    { required_error: 'Le type de robot est obligatoire' }
  ),
});

// Type inféré depuis Zod
export type RobotFormValues = z.infer<typeof robotValidationSchema>;

// Valeurs par défaut pour le formulaire
export const defaultRobotValues: RobotFormValues = {
  name: '',
  label: '',
  year: new Date().getFullYear(),
  type: RobotType.OTHER,
};

// Labels pour l'interface utilisateur
export const robotTypeLabels: Record<RobotTypeValue, string> = {
  [RobotType.INDUSTRIAL]: 'Industriel',
  [RobotType.SERVICE]: 'Service',
  [RobotType.MEDICAL]: 'Médical',
  [RobotType.EDUCATIONAL]: 'Éducatif',
  [RobotType.OTHER]: 'Autre',
};

// Options pour le picker
export const robotTypeOptions = Object.entries(robotTypeLabels).map(([value, label]) => ({
  value: value as RobotTypeValue,
  label,
}));