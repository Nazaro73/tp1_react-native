import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { Robot, RobotInput } from '../validation/robotSchema';

// Interface du state
interface RobotsState {
  robots: Robot[];
  selectedId?: string;
}

// Interface des actions
interface RobotsActions {
  // Actions CRUD
  create: (robotInput: RobotInput) => Promise<{ success: boolean; error?: string; robot?: Robot }>;
  update: (id: string, robotInput: RobotInput) => Promise<{ success: boolean; error?: string; robot?: Robot }>;
  remove: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Sélecteurs
  getById: (id: string) => Robot | undefined;
  getRobots: () => Robot[];
  isNameUnique: (name: string, excludeId?: string) => boolean;
  
  // Actions UI
  setSelectedId: (id?: string) => void;
  clearSelected: () => void;
  
  // Actions de maintenance
  clearAll: () => void;
}

// Type complet du store
export type RobotsStore = RobotsState & RobotsActions;

// Création du store avec persistance
export const useRobotsStore = create<RobotsStore>()(
  persist(
    (set, get) => ({
      // State initial
      robots: [],
      selectedId: undefined,

      // Actions CRUD
      create: async (robotInput: RobotInput) => {
        try {
          const state = get();
          
          // Vérifier l'unicité du nom
          if (!state.isNameUnique(robotInput.name)) {
            return { 
              success: false, 
              error: `Un robot avec le nom "${robotInput.name}" existe déjà` 
            };
          }

          // Créer le nouveau robot
          const newRobot: Robot = {
            id: uuid.v4() as string,
            name: robotInput.name.trim(),
            label: robotInput.label.trim(),
            year: robotInput.year,
            type: robotInput.type,
          };

          // Ajouter au store
          set((state) => ({
            robots: [...state.robots, newRobot].sort((a, b) => a.name.localeCompare(b.name)),
          }));

          console.log('✅ [RobotsStore] Robot créé:', newRobot);
          return { success: true, robot: newRobot };
        } catch (error) {
          console.error('❌ [RobotsStore] Erreur création robot:', error);
          return { success: false, error: 'Erreur lors de la création du robot' };
        }
      },

      update: async (id: string, robotInput: RobotInput) => {
        try {
          const state = get();
          const existingRobot = state.getById(id);
          
          if (!existingRobot) {
            return { success: false, error: 'Robot non trouvé' };
          }

          // Vérifier l'unicité du nom (exclure le robot actuel)
          if (!state.isNameUnique(robotInput.name, id)) {
            return { 
              success: false, 
              error: `Un robot avec le nom "${robotInput.name}" existe déjà` 
            };
          }

          // Mettre à jour le robot
          const updatedRobot: Robot = {
            ...existingRobot,
            name: robotInput.name.trim(),
            label: robotInput.label.trim(),
            year: robotInput.year,
            type: robotInput.type,
          };

          set((state) => ({
            robots: state.robots
              .map(robot => robot.id === id ? updatedRobot : robot)
              .sort((a, b) => a.name.localeCompare(b.name)),
          }));

          console.log('✅ [RobotsStore] Robot mis à jour:', updatedRobot);
          return { success: true, robot: updatedRobot };
        } catch (error) {
          console.error('❌ [RobotsStore] Erreur mise à jour robot:', error);
          return { success: false, error: 'Erreur lors de la mise à jour du robot' };
        }
      },

      remove: async (id: string) => {
        try {
          const state = get();
          const robot = state.getById(id);
          
          if (!robot) {
            return { success: false, error: 'Robot non trouvé' };
          }

          set((state) => ({
            robots: state.robots.filter(r => r.id !== id),
            selectedId: state.selectedId === id ? undefined : state.selectedId,
          }));

          console.log('✅ [RobotsStore] Robot supprimé:', robot.name);
          return { success: true };
        } catch (error) {
          console.error('❌ [RobotsStore] Erreur suppression robot:', error);
          return { success: false, error: 'Erreur lors de la suppression du robot' };
        }
      },

      // Sélecteurs
      getById: (id: string) => {
        return get().robots.find(robot => robot.id === id);
      },

      getRobots: () => {
        return get().robots;
      },

      isNameUnique: (name: string, excludeId?: string) => {
        const robots = get().robots;
        const trimmedName = name.trim().toLowerCase();
        
        return !robots.some(robot => 
          robot.id !== excludeId && 
          robot.name.toLowerCase() === trimmedName
        );
      },

      // Actions UI
      setSelectedId: (id?: string) => {
        set({ selectedId: id });
      },

      clearSelected: () => {
        set({ selectedId: undefined });
      },

      // Actions de maintenance
      clearAll: () => {
        set({ robots: [], selectedId: undefined });
        console.log('🗑️ [RobotsStore] Tous les robots supprimés');
      },
    }),
    {
      name: 'robots-storage', // nom unique pour le storage
      storage: createJSONStorage(() => AsyncStorage),
      
      // Ne persister que les données, pas les fonctions
      partialize: (state) => ({ 
        robots: state.robots,
        selectedId: state.selectedId 
      }),
      
      // Log lors de la restauration
      onRehydrateStorage: (state) => {
        console.log('🔄 [RobotsStore] Restauration du store depuis AsyncStorage');
        return (state, error) => {
          if (error) {
            console.error('❌ [RobotsStore] Erreur lors de la restauration:', error);
          } else {
            console.log('✅ [RobotsStore] Store restauré avec', state?.robots?.length || 0, 'robots');
          }
        };
      },
    }
  )
);

// Sélecteurs optimisés pour éviter les re-renders inutiles
export const useRobots = () => useRobotsStore(state => state.robots);
export const useRobotById = (id: string) => useRobotsStore(state => state.getById(id));
export const useSelectedRobotId = () => useRobotsStore(state => state.selectedId);
export const useRobotsActions = () => useRobotsStore(state => ({
  create: state.create,
  update: state.update,
  remove: state.remove,
  setSelectedId: state.setSelectedId,
  clearSelected: state.clearSelected,
  isNameUnique: state.isNameUnique,
}));