import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Hooks typés pour TypeScript
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Hook personnalisé pour les actions robots avec error handling
export const useRobotsActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    dispatch, // Pour les actions directes
    
    // Wrapper pour les actions avec gestion d'erreur
    dispatchWithErrorHandling: async (action: any) => {
      try {
        const result = await dispatch(action);
        if (action.type?.includes('rejected')) {
          console.error('❌ [Redux] Action rejetée:', result);
          return { success: false, error: result.payload || 'Erreur inconnue' };
        }
        return { success: true, data: result.payload };
      } catch (error) {
        console.error('❌ [Redux] Erreur dispatch:', error);
        return { success: false, error: 'Erreur lors de l\'exécution de l\'action' };
      }
    },
  };
};