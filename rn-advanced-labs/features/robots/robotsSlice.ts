import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import uuid from 'react-native-uuid';
import { Robot, RobotInput } from '../../validation/robotSchema';

// Interface du state
export interface RobotsState {
  items: Robot[];
  isLoading: boolean;
  error: string | null;
}

// State initial
const initialState: RobotsState = {
  items: [],
  isLoading: false,
  error: null,
};

// Types pour les actions
interface UpdateRobotPayload {
  id: string;
  changes: RobotInput;
}

// Thunks asynchrones (simulation d'API)
export const saveRobotAsync = createAsyncThunk(
  'robots/saveRobotAsync',
  async (payload: { robot: RobotInput; mode: 'create' | 'update'; id?: string }, { rejectWithValue, getState }) => {
    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const state = getState() as { robots: RobotsState };
      const { robot, mode, id } = payload;

      // Validation d'unicité côté thunk
      if (mode === 'create') {
        const nameExists = state.robots.items.some(
          r => r.name.toLowerCase().trim() === robot.name.toLowerCase().trim()
        );
        if (nameExists) {
          return rejectWithValue(`Un robot avec le nom "${robot.name}" existe déjà`);
        }
      } else if (mode === 'update' && id) {
        const nameExists = state.robots.items.some(
          r => r.id !== id && r.name.toLowerCase().trim() === robot.name.toLowerCase().trim()
        );
        if (nameExists) {
          return rejectWithValue(`Un robot avec le nom "${robot.name}" existe déjà`);
        }
      }

      return { robot, mode, id };
    } catch (error) {
      return rejectWithValue('Erreur lors de la sauvegarde');
    }
  }
);

export const deleteRobotAsync = createAsyncThunk(
  'robots/deleteRobotAsync',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 300));
      return id;
    } catch (error) {
      return rejectWithValue('Erreur lors de la suppression');
    }
  }
);

// Thunk pour charger les robots (simulation - en réalité, ils sont déjà persistés)
export const loadRobots = createAsyncThunk(
  'robots/loadRobots',
  async (_, { rejectWithValue }) => {
    try {
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // En réalité, les données viennent de la persistance Redux
      // Ce thunk sert principalement à déclencher l'état de chargement
      console.log('📡 [LoadRobots] Chargement simulé des robots');
      return null; // Ne retourne rien car les données sont déjà dans le store persisté
    } catch (error) {
      return rejectWithValue('Erreur lors du chargement');
    }
  }
);

// Slice Redux Toolkit
export const robotsSlice = createSlice({
  name: 'robots',
  initialState,
  reducers: {
    // Reducers synchrones pour les cas simples
    createRobot: (state, action: PayloadAction<RobotInput>) => {
      const robot = action.payload;
      
      // Vérifier l'unicité du nom
      const nameExists = state.items.some(
        r => r.name.toLowerCase().trim() === robot.name.toLowerCase().trim()
      );
      
      if (nameExists) {
        state.error = `Un robot avec le nom "${robot.name}" existe déjà`;
        return;
      }

      // Créer le nouveau robot
      const newRobot: Robot = {
        id: uuid.v4() as string,
        name: robot.name.trim(),
        label: robot.label.trim(),
        year: robot.year,
        type: robot.type,
      };

      state.items.push(newRobot);
      state.items.sort((a, b) => a.name.localeCompare(b.name));
      state.error = null;
      
      console.log('✅ [RobotsSlice] Robot créé:', newRobot);
    },

    updateRobot: (state, action: PayloadAction<UpdateRobotPayload>) => {
      const { id, changes } = action.payload;
      const robotIndex = state.items.findIndex(r => r.id === id);
      
      if (robotIndex === -1) {
        state.error = 'Robot non trouvé';
        return;
      }

      // Vérifier l'unicité du nom (exclure le robot actuel)
      const nameExists = state.items.some(
        r => r.id !== id && r.name.toLowerCase().trim() === changes.name.toLowerCase().trim()
      );
      
      if (nameExists) {
        state.error = `Un robot avec le nom "${changes.name}" existe déjà`;
        return;
      }

      // Mettre à jour le robot
      state.items[robotIndex] = {
        ...state.items[robotIndex],
        name: changes.name.trim(),
        label: changes.label.trim(),
        year: changes.year,
        type: changes.type,
      };

      state.items.sort((a, b) => a.name.localeCompare(b.name));
      state.error = null;
      
      console.log('✅ [RobotsSlice] Robot mis à jour:', state.items[robotIndex]);
    },

    deleteRobot: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const robotIndex = state.items.findIndex(r => r.id === id);
      
      if (robotIndex === -1) {
        state.error = 'Robot non trouvé';
        return;
      }

      const deletedRobot = state.items[robotIndex];
      state.items.splice(robotIndex, 1);
      state.error = null;
      
      console.log('✅ [RobotsSlice] Robot supprimé:', deletedRobot.name);
    },

    clearError: (state) => {
      state.error = null;
    },

    clearAllRobots: (state) => {
      state.items = [];
      state.error = null;
      console.log('🗑️ [RobotsSlice] Tous les robots supprimés');
    },
  },
  extraReducers: (builder) => {
    // Gestion des thunks asynchrones
    builder
      // loadRobots
      .addCase(loadRobots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        console.log('⏳ [RobotsSlice] Chargement des robots...');
      })
      .addCase(loadRobots.fulfilled, (state) => {
        state.isLoading = false;
        console.log('✅ [RobotsSlice] Robots chargés depuis la persistance');
      })
      .addCase(loadRobots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ [RobotsSlice] Erreur chargement:', action.payload);
      })
      
      // saveRobotAsync
      .addCase(saveRobotAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveRobotAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const { robot, mode, id } = action.payload;

        if (mode === 'create') {
          const newRobot: Robot = {
            id: uuid.v4() as string,
            name: robot.name.trim(),
            label: robot.label.trim(),
            year: robot.year,
            type: robot.type,
          };
          state.items.push(newRobot);
          console.log('✅ [RobotsSlice] Robot créé (async):', newRobot);
        } else if (mode === 'update' && id) {
          const robotIndex = state.items.findIndex(r => r.id === id);
          if (robotIndex !== -1) {
            state.items[robotIndex] = {
              ...state.items[robotIndex],
              name: robot.name.trim(),
              label: robot.label.trim(),
              year: robot.year,
              type: robot.type,
            };
            console.log('✅ [RobotsSlice] Robot mis à jour (async):', state.items[robotIndex]);
          }
        }

        state.items.sort((a, b) => a.name.localeCompare(b.name));
      })
      .addCase(saveRobotAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ [RobotsSlice] Erreur sauvegarde:', action.payload);
      })
      
      // deleteRobotAsync
      .addCase(deleteRobotAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteRobotAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const id = action.payload;
        const robotIndex = state.items.findIndex(r => r.id === id);
        
        if (robotIndex !== -1) {
          const deletedRobot = state.items[robotIndex];
          state.items.splice(robotIndex, 1);
          console.log('✅ [RobotsSlice] Robot supprimé (async):', deletedRobot.name);
        }
      })
      .addCase(deleteRobotAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        console.error('❌ [RobotsSlice] Erreur suppression:', action.payload);
      });
  },
});

// Export des actions
export const {
  createRobot,
  updateRobot,
  deleteRobot,
  clearError,
  clearAllRobots,
} = robotsSlice.actions;

// Export du reducer
export default robotsSlice.reducer;