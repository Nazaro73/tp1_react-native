import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer, { RootState } from './rootReducer';

// Configuration de la persistance
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['robots'], // Ne persister que la slice robots
  version: 1,
  debug: __DEV__, // Logs uniquement en développement
};

// Reducer persisté
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/FLUSH',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PERSIST',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }),
  devTools: __DEV__, // Redux DevTools uniquement en dev
});

// Persistor pour la réhydratation
export const persistor = persistStore(store, {}, () => {
  console.log('✅ [Redux] Store persisté et réhydraté');
});

// Types pour TypeScript
export type AppDispatch = typeof store.dispatch;
export type { RootState };

// Log du store pour debug
if (__DEV__) {
  console.log('🏪 [Redux] Store configuré avec persistance');
}