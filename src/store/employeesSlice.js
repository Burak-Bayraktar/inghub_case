import { createSlice } from '@reduxjs/toolkit';

let idCounter = 1;

const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    viewMode: 'list'
  },
  reducers: {
    addEmployee: (state, action) => {
      const newEmployee = {
        ...action.payload,
        id: (Date.now() + idCounter++).toString()
      };
      state.employees.push(newEmployee);
    },
    updateEmployee: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.employees.findIndex(emp => emp.id === id);
      if (index !== -1) {
        state.employees[index] = { ...state.employees[index], ...updates };
      }
    },
    deleteEmployee: (state, action) => {
      state.employees = state.employees.filter(emp => emp.id !== action.payload);
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    reset: (state) => {
      state.employees = [];
      state.viewMode = 'list';
      idCounter = 1;
    }
  }
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  setViewMode,
  reset
} = employeesSlice.actions;

export default employeesSlice.reducer;
