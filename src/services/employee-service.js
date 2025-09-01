import { 
  addEmployee, 
  updateEmployee, 
  deleteEmployee,
  setViewMode
} from '../store/employeesSlice.js';
import { store } from '../store/index.js';

export class EmployeeService {
  static _testStore = null;
  
  static get store() {
    return this._testStore || window.__MOCK_STORE__ || store;
  }
  
  static set store(testStore) {
    this._testStore = testStore;
  }
  
  static getStore() {
    return this.store;
  }

  static getAllEmployees() {
    return this.getStore().getState().employees.employees;
  }

  static getEmployeesPaginated(page = 1, pageSize = 9) {
    const employees = this.getAllEmployees();
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    return {
      data: employees.slice(startIndex, endIndex),
      total: employees.length,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(employees.length / pageSize)
    };
  }

  static getEmployeeById(id) {
    if (id === null || id === undefined) {
      return undefined;
    }
    const employees = this.getAllEmployees();
    return employees.find(employee => employee.id === id.toString());
  }

  static isEmailUnique(email, excludeEmployeeId = null) {
    if (!email) return true;
    const employees = this.getAllEmployees();
    return !employees.some(employee => 
      employee.email === email && employee.id !== excludeEmployeeId?.toString()
    );
  }

  static searchEmployees(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getAllEmployees();
    }
    
    const employees = this.getAllEmployees();
    const term = searchTerm.toLowerCase().trim();
    
    return employees.filter(employee => {
      return (
        employee.firstName?.toLowerCase().includes(term) ||
        employee.lastName?.toLowerCase().includes(term) ||
        employee.email?.toLowerCase().includes(term) ||
        employee.phone?.toLowerCase().includes(term) ||
        employee.position?.toLowerCase().includes(term) ||
        employee.department?.toLowerCase().includes(term) ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(term)
      );
    });
  }

  static addEmployee(employeeData) {
    const employee = {
      ...employeeData,
      id: Math.floor(Date.now() + Math.random() * 1000).toString(), // Ensure unique string ID
      dateHired: new Date().toISOString().split('T')[0]
    };
    
    const store = this.getStore();
    store.dispatch(addEmployee(employee));
    return employee;
  }

  static updateEmployee(id, employeeData) {
    const existingEmployee = this.getEmployeeById(id);
    if (!existingEmployee) {
      return undefined;
    }
    
    const updatedEmployee = {
      ...existingEmployee,
      ...employeeData,
      id: id.toString()
    };
    
    const store = this.getStore();
    store.dispatch(updateEmployee(updatedEmployee));
    return updatedEmployee;
  }

  static deleteEmployee(id) {
    const employee = this.getEmployeeById(id);
    if (!employee) {
      return false;
    }
    
    const store = this.getStore();
    store.dispatch(deleteEmployee(id.toString()));
    return true;
  }

  static getViewMode() {
    return this.getStore().getState().employees.viewMode;
  }

  static setViewMode(mode) {
    const store = this.getStore();
    store.dispatch(setViewMode(mode));
  }

  static subscribe(callback) {
    const store = this.getStore();
    return store.subscribe(callback);
  }
}
