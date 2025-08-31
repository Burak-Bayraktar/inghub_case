import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from './employeesSlice.js';

const saveToLocalStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('ing-employee-management', serializedState);
  } catch (err) {
    console.warn('Could not save state', err);
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('ing-employee-management');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.warn('Could not load state', err);
    return undefined;
  }
};

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    employees: employeesReducer
  },
  preloadedState: persistedState ? { employees: persistedState.employees } : undefined
});

store.subscribe(() => {
  saveToLocalStorage(store.getState());
});
