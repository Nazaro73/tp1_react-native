import { combineReducers } from '@reduxjs/toolkit';
import robotsReducer from '../../features/robots/robotsSlice';

const rootReducer = combineReducers({
  robots: robotsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;