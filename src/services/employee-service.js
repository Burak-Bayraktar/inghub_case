import { 
  addEmployee, 
  updateEmployee, 
  deleteEmployee
} from '../store/employeesSlice.js';
import { store } from '../store/index.js';

export class EmployeeService {
  static getStore() {
    return store;
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
    const employees = this.getAllEmployees();
    return employees.find(employee => employee.id === id);
  }

  static addEmployee(employeeData) {
    const store = this.getStore();
    store.dispatch(addEmployee(employeeData));
    return true;
  }

  static updateEmployee(id, employeeData) {
    const store = this.getStore();
    store.dispatch(updateEmployee({ id, ...employeeData }));
    return true;
  }

  static deleteEmployee(id) {
    const store = this.getStore();
    store.dispatch(deleteEmployee(id));
    return true;
  }

  static subscribe(callback) {
    const store = this.getStore();
    return store.subscribe(callback);
  }
}
