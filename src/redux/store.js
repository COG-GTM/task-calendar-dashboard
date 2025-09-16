import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import rulesReducer from './rulesSlice';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    rules: rulesReducer,
  },
});
