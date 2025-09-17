import { Platform } from 'react-native';

// Fonction utilitaire pour créer des ombres compatibles avec React Native Web
export const createShadow = (
  elevation: number,
  shadowColor: string = '#000',
  shadowOpacity: number = 0.1
) => {
  if (Platform.OS === 'web') {
    // Pour le web, utiliser boxShadow
    const shadowOffset = elevation * 0.5;
    const shadowBlur = elevation * 2;
    return {
      boxShadow: `0px ${shadowOffset}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`,
    };
  } else if (Platform.OS === 'android') {
    // Pour Android, utiliser elevation
    return {
      elevation,
    };
  } else {
    // Pour iOS, utiliser les propriétés shadow
    return {
      shadowColor,
      shadowOffset: { width: 0, height: elevation * 0.5 },
      shadowOpacity,
      shadowRadius: elevation,
    };
  }
};

// Présets d'ombres communes
export const shadows = {
  small: createShadow(2),
  medium: createShadow(4),
  large: createShadow(8),
};