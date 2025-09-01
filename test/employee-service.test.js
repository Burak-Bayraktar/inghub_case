import { expect } from '@open-wc/testing';
import { configureStore } from '@reduxjs/toolkit';
import { EmployeeService } from '../src/services/employee-service.js';
import employeesReducer, { 
  setViewMode 
} from '../src/store/employeesSlice.js';

describe('EmployeeService', () => {
  let testStore;

  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        employees: employeesReducer
      },
      preloadedState: {
        employees: {
          employees: [
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '+90 555 123 4567',
              position: 'Software Engineer',
              department: 'IT',
              dateHired: '2023-01-15'
            },
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              email: 'jane.smith@example.com',
              phone: '+90 555 987 6543',
              position: 'UX Designer',
              department: 'Design',
              dateHired: '2023-02-20'
            },
            {
              id: '3',
              firstName: 'Bob',
              lastName: 'Johnson',
              email: 'bob.johnson@example.com',
              phone: '+90 555 246 8135',
              position: 'Product Manager',
              department: 'Product',
              dateHired: '2023-03-10'
            }
          ],
          viewMode: 'table'
        }
      }
    });
    
    EmployeeService.store = testStore;
  });

  afterEach(() => {
    EmployeeService.store = null;
  });

  describe('store management', () => {
    it('should get store correctly', () => {
      const store = EmployeeService.getStore();
      expect(store).to.equal(testStore);
    });

    it('should set test store correctly', () => {
      const newStore = configureStore({
        reducer: {
          employees: employeesReducer
        }
      });
      
      EmployeeService.store = newStore;
      expect(EmployeeService.getStore()).to.equal(newStore);
    });

    it('should fall back to window.__MOCK_STORE__ when test store is null', () => {
      EmployeeService.store = null;
      const mockStore = { test: 'mock' };
      window.__MOCK_STORE__ = mockStore;
      
      expect(EmployeeService.store).to.equal(mockStore);
      
      delete window.__MOCK_STORE__;
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees from store', () => {
      const employees = EmployeeService.getAllEmployees();
      expect(employees).to.have.lengthOf(3);
      expect(employees[0].firstName).to.equal('John');
      expect(employees[1].firstName).to.equal('Jane');
      expect(employees[2].firstName).to.equal('Bob');
    });

    it('should return empty array when no employees exist', () => {
      const emptyStore = configureStore({
        reducer: {
          employees: employeesReducer
        },
        preloadedState: {
          employees: {
            employees: [],
            viewMode: 'table'
          }
        }
      });
      
      EmployeeService.store = emptyStore;
      const employees = EmployeeService.getAllEmployees();
      expect(employees).to.have.lengthOf(0);
      expect(employees).to.be.an('array');
    });
  });

  describe('getEmployeesPaginated', () => {
    it('should return paginated employees with default parameters', () => {
      const result = EmployeeService.getEmployeesPaginated();
      
      expect(result.data).to.have.lengthOf(3);
      expect(result.total).to.equal(3);
      expect(result.currentPage).to.equal(1);
      expect(result.pageSize).to.equal(9);
      expect(result.totalPages).to.equal(1);
    });

    it('should return correct page with custom page size', () => {
      const result = EmployeeService.getEmployeesPaginated(1, 2);
      
      expect(result.data).to.have.lengthOf(2);
      expect(result.data[0].firstName).to.equal('John');
      expect(result.data[1].firstName).to.equal('Jane');
      expect(result.total).to.equal(3);
      expect(result.currentPage).to.equal(1);
      expect(result.pageSize).to.equal(2);
      expect(result.totalPages).to.equal(2);
    });

    it('should return correct second page', () => {
      const result = EmployeeService.getEmployeesPaginated(2, 2);
      
      expect(result.data).to.have.lengthOf(1);
      expect(result.data[0].firstName).to.equal('Bob');
      expect(result.total).to.equal(3);
      expect(result.currentPage).to.equal(2);
      expect(result.pageSize).to.equal(2);
      expect(result.totalPages).to.equal(2);
    });

    it('should return empty data for out of range page', () => {
      const result = EmployeeService.getEmployeesPaginated(5, 2);
      
      expect(result.data).to.have.lengthOf(0);
      expect(result.total).to.equal(3);
      expect(result.currentPage).to.equal(5);
      expect(result.pageSize).to.equal(2);
      expect(result.totalPages).to.equal(2);
    });

    it('should handle edge case with page size 1', () => {
      const result = EmployeeService.getEmployeesPaginated(2, 1);
      
      expect(result.data).to.have.lengthOf(1);
      expect(result.data[0].firstName).to.equal('Jane');
      expect(result.totalPages).to.equal(3);
    });

    it('should handle large page size', () => {
      const result = EmployeeService.getEmployeesPaginated(1, 100);
      
      expect(result.data).to.have.lengthOf(3);
      expect(result.totalPages).to.equal(1);
    });
  });

  describe('getEmployeeById', () => {
    it('should return employee with matching id', () => {
      const employee = EmployeeService.getEmployeeById('2');
      
      expect(employee).to.not.be.undefined;
      expect(employee.firstName).to.equal('Jane');
      expect(employee.lastName).to.equal('Smith');
      expect(employee.id).to.equal('2');
    });

    it('should return employee when id is passed as number', () => {
      const employee = EmployeeService.getEmployeeById(2);
      
      expect(employee).to.not.be.undefined;
      expect(employee.firstName).to.equal('Jane');
    });

    it('should return undefined for non-existent id', () => {
      const employee = EmployeeService.getEmployeeById('999');
      
      expect(employee).to.be.undefined;
    });

    it('should return undefined for null id', () => {
      const employee = EmployeeService.getEmployeeById(null);
      
      expect(employee).to.be.undefined;
    });

    it('should return undefined for undefined id', () => {
      const employee = EmployeeService.getEmployeeById(undefined);
      
      expect(employee).to.be.undefined;
    });
  });

  describe('addEmployee', () => {
    it('should add new employee with generated id and date', () => {
      const newEmployeeData = {
        firstName: 'Alice',
        lastName: 'Wilson',
        email: 'alice.wilson@example.com',
        phone: '+90 555 111 2222',
        position: 'Data Scientist',
        department: 'Analytics'
      };

      const addedEmployee = EmployeeService.addEmployee(newEmployeeData);
      
      expect(addedEmployee.firstName).to.equal('Alice');
      expect(addedEmployee.lastName).to.equal('Wilson');
      expect(addedEmployee.id).to.be.a('string');
      expect(addedEmployee.dateHired).to.be.a('string');
      expect(addedEmployee.dateHired).to.match(/^\d{4}-\d{2}-\d{2}$/);
      
      const allEmployees = EmployeeService.getAllEmployees();
      expect(allEmployees).to.have.lengthOf(4);
      
      const foundEmployee = allEmployees.find(emp => emp.firstName === 'Alice');
      expect(foundEmployee).to.not.be.undefined;
    });

    it('should generate unique ids for multiple employees', () => {
      const employee1 = EmployeeService.addEmployee({
        firstName: 'Test1',
        lastName: 'User1',
        email: 'test1@example.com'
      });

      const employee2 = EmployeeService.addEmployee({
        firstName: 'Test2',
        lastName: 'User2',
        email: 'test2@example.com'
      });

      expect(employee1.id).to.not.equal(employee2.id);
      expect(employee1.id).to.be.a('string');
      expect(employee2.id).to.be.a('string');
    });

    it('should preserve all provided employee data', () => {
      const employeeData = {
        firstName: 'Complete',
        lastName: 'Employee',
        email: 'complete@example.com',
        phone: '+90 555 999 8888',
        position: 'Senior Developer',
        department: 'Engineering'
      };

      const addedEmployee = EmployeeService.addEmployee(employeeData);
      
      expect(addedEmployee.firstName).to.equal(employeeData.firstName);
      expect(addedEmployee.lastName).to.equal(employeeData.lastName);
      expect(addedEmployee.email).to.equal(employeeData.email);
      expect(addedEmployee.phone).to.equal(employeeData.phone);
      expect(addedEmployee.position).to.equal(employeeData.position);
      expect(addedEmployee.department).to.equal(employeeData.department);
    });
  });

  describe('updateEmployee', () => {
    it('should update existing employee', () => {
      const updateData = {
        firstName: 'Updated John',
        position: 'Senior Software Engineer'
      };

      const updatedEmployee = EmployeeService.updateEmployee('1', updateData);
      
      expect(updatedEmployee).to.not.be.undefined;
      expect(updatedEmployee.firstName).to.equal('Updated John');
      expect(updatedEmployee.position).to.equal('Senior Software Engineer');
      expect(updatedEmployee.lastName).to.equal('Doe');
      expect(updatedEmployee.id).to.equal('1');
      
      const employee = EmployeeService.getEmployeeById('1');
      expect(employee.firstName).to.equal('Updated John');
    });

    it('should update employee when id is passed as number', () => {
      const updateData = {
        firstName: 'Updated Jane'
      };

      const updatedEmployee = EmployeeService.updateEmployee(2, updateData);
      
      expect(updatedEmployee).to.not.be.undefined;
      expect(updatedEmployee.firstName).to.equal('Updated Jane');
      expect(updatedEmployee.id).to.equal('2');
    });

    it('should return undefined for non-existent employee', () => {
      const updateData = {
        firstName: 'Non Existent'
      };

      const result = EmployeeService.updateEmployee('999', updateData);
      
      expect(result).to.be.undefined;
    });

    it('should preserve id when updating', () => {
      const updateData = {
        id: 'new-id',
        firstName: 'Test'
      };

      const updatedEmployee = EmployeeService.updateEmployee('1', updateData);
      
      expect(updatedEmployee.id).to.equal('1');
      expect(updatedEmployee.firstName).to.equal('Test');
    });

    it('should handle partial updates', () => {
      const originalEmployee = EmployeeService.getEmployeeById('1');
      
      const updateData = {
        email: 'new.email@example.com'
      };

      const updatedEmployee = EmployeeService.updateEmployee('1', updateData);
      
      expect(updatedEmployee.email).to.equal('new.email@example.com');
      expect(updatedEmployee.firstName).to.equal(originalEmployee.firstName);
      expect(updatedEmployee.lastName).to.equal(originalEmployee.lastName);
      expect(updatedEmployee.position).to.equal(originalEmployee.position);
    });
  });

  describe('deleteEmployee', () => {
    it('should delete existing employee', () => {
      const result = EmployeeService.deleteEmployee('2');
      
      expect(result).to.be.true;
      
      const allEmployees = EmployeeService.getAllEmployees();
      expect(allEmployees).to.have.lengthOf(2);
      
      const deletedEmployee = EmployeeService.getEmployeeById('2');
      expect(deletedEmployee).to.be.undefined;
    });

    it('should delete employee when id is passed as number', () => {
      const result = EmployeeService.deleteEmployee(1);
      
      expect(result).to.be.true;
      
      const deletedEmployee = EmployeeService.getEmployeeById('1');
      expect(deletedEmployee).to.be.undefined;
    });

    it('should return false for non-existent employee', () => {
      const result = EmployeeService.deleteEmployee('999');
      
      expect(result).to.be.false;
      
      const allEmployees = EmployeeService.getAllEmployees();
      expect(allEmployees).to.have.lengthOf(3);
    });

    it('should handle multiple deletions correctly', () => {
      EmployeeService.deleteEmployee('1');
      EmployeeService.deleteEmployee('2');
      
      const allEmployees = EmployeeService.getAllEmployees();
      expect(allEmployees).to.have.lengthOf(1);
      expect(allEmployees[0].firstName).to.equal('Bob');
    });
  });

  describe('getViewMode', () => {
    it('should return current view mode from store', () => {
      const viewMode = EmployeeService.getViewMode();
      expect(viewMode).to.equal('table');
    });

    it('should return updated view mode after change', () => {
      testStore.dispatch(setViewMode('list'));
      
      const viewMode = EmployeeService.getViewMode();
      expect(viewMode).to.equal('list');
    });
  });

  describe('setViewMode', () => {
    it('should update view mode in store', () => {
      EmployeeService.setViewMode('list');
      
      const viewMode = EmployeeService.getViewMode();
      expect(viewMode).to.equal('list');
    });

    it('should handle switching between view modes', () => {
      EmployeeService.setViewMode('list');
      expect(EmployeeService.getViewMode()).to.equal('list');
      
      EmployeeService.setViewMode('table');
      expect(EmployeeService.getViewMode()).to.equal('table');
    });
  });

  describe('subscribe', () => {
    it('should subscribe to store changes', () => {
      let callbackCalled = false;
      let callbackCount = 0;
      
      const unsubscribe = EmployeeService.subscribe(() => {
        callbackCalled = true;
        callbackCount++;
      });
      
      EmployeeService.addEmployee({
        firstName: 'Subscriber',
        lastName: 'Test',
        email: 'test@example.com'
      });
      
      expect(callbackCalled).to.be.true;
      expect(callbackCount).to.be.greaterThan(0);
      
      unsubscribe();
    });

    it('should unsubscribe correctly', () => {
      let callbackCount = 0;
      
      const unsubscribe = EmployeeService.subscribe(() => {
        callbackCount++;
      });
      
      EmployeeService.addEmployee({
        firstName: 'Test1',
        lastName: 'User1',
        email: 'test1@example.com'
      });
      
      const countAfterFirst = callbackCount;
      
      unsubscribe();
      
      EmployeeService.addEmployee({
        firstName: 'Test2',
        lastName: 'User2',
        email: 'test2@example.com'
      });
      
      expect(callbackCount).to.equal(countAfterFirst);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty employee data in addEmployee', () => {
      const result = EmployeeService.addEmployee({});
      
      expect(result.id).to.be.a('string');
      expect(result.dateHired).to.be.a('string');
    });

    it('should handle null employee data in addEmployee', () => {
      const result = EmployeeService.addEmployee(null);
      
      expect(result.id).to.be.a('string');
      expect(result.dateHired).to.be.a('string');
    });

    it('should handle undefined employee data in addEmployee', () => {
      const result = EmployeeService.addEmployee(undefined);
      
      expect(result.id).to.be.a('string');
      expect(result.dateHired).to.be.a('string');
    });

    it('should handle empty update data in updateEmployee', () => {
      const originalEmployee = EmployeeService.getEmployeeById('1');
      const result = EmployeeService.updateEmployee('1', {});
      
      expect(result).to.deep.equal(originalEmployee);
    });

    it('should handle null update data in updateEmployee', () => {
      const originalEmployee = EmployeeService.getEmployeeById('1');
      const result = EmployeeService.updateEmployee('1', null);
      
      expect(result.firstName).to.equal(originalEmployee.firstName);
      expect(result.id).to.equal('1');
    });
  });

  describe('isEmailUnique', () => {
    it('should return true for unique email', () => {
      const isUnique = EmployeeService.isEmailUnique('new.email@example.com');
      expect(isUnique).to.be.true;
    });

    it('should return false for existing email', () => {
      const isUnique = EmployeeService.isEmailUnique('john.doe@example.com');
      expect(isUnique).to.be.false;
    });

    it('should return true for empty email', () => {
      const isUnique = EmployeeService.isEmailUnique('');
      expect(isUnique).to.be.true;
    });

    it('should return true for null email', () => {
      const isUnique = EmployeeService.isEmailUnique(null);
      expect(isUnique).to.be.true;
    });

    it('should exclude employee when updating', () => {
      const isUnique = EmployeeService.isEmailUnique('john.doe@example.com', '1');
      expect(isUnique).to.be.true;
    });

    it('should handle non-string exclude ID', () => {
      const isUnique = EmployeeService.isEmailUnique('john.doe@example.com', 1);
      expect(isUnique).to.be.true;
    });
  });

  describe('data validation edge cases', () => {
    it('should handle employees with unicode characters', () => {
      const employee = EmployeeService.addEmployee({
        firstName: 'Müge',
        lastName: 'Öztürk',
        email: 'muge.ozturk@example.com',
        phone: '+90 555 123 4567',
        position: 'Geliştirici',
        department: 'Mühendislik'
      });
      
      expect(employee.firstName).to.equal('Müge');
      expect(employee.lastName).to.equal('Öztürk');
      expect(employee.position).to.equal('Geliştirici');
      expect(employee.department).to.equal('Mühendislik');
    });

    it('should handle employees with very long names', () => {
      const longName = 'A'.repeat(100);
      const employee = EmployeeService.addEmployee({
        firstName: longName,
        lastName: longName,
        email: 'long.name@example.com',
        position: 'Developer',
        department: 'Engineering'
      });
      
      expect(employee.firstName).to.equal(longName);
      expect(employee.lastName).to.equal(longName);
    });

    it('should handle empty string properties', () => {
      const employee = EmployeeService.addEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: '',
        department: ''
      });
      
      expect(employee.id).to.be.a('string');
      expect(employee.dateHired).to.be.a('string');
    });

    it('should handle null and undefined properties', () => {
      const employee = EmployeeService.addEmployee({
        firstName: null,
        lastName: undefined,
        email: null,
        phone: undefined,
        position: null,
        department: undefined
      });
      
      expect(employee.id).to.be.a('string');
      expect(employee.dateHired).to.be.a('string');
    });
  });

  describe('performance tests', () => {
    it('should handle large datasets efficiently', () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 1000; i++) {
        EmployeeService.addEmployee({
          firstName: `Employee${i}`,
          lastName: `Test${i}`,
          email: `employee${i}@example.com`,
          phone: `+90 555 ${String(i).padStart(7, '0')}`,
          position: 'Developer',
          department: 'Engineering'
        });
      }
      
      const addTime = performance.now() - startTime;
      expect(addTime).to.be.lessThan(5000);
      
      const getAllStartTime = performance.now();
      const allEmployees = EmployeeService.getAllEmployees();
      const getAllTime = performance.now() - getAllStartTime;
      
      expect(allEmployees).to.have.lengthOf(1003);
      expect(getAllTime).to.be.lessThan(100);
    });

    it('should handle frequent updates efficiently', () => {
      const employees = EmployeeService.getAllEmployees();
      const targetId = employees[0].id;
      
      const startTime = performance.now();
      
      for (let i = 0; i < 100; i++) {
        EmployeeService.updateEmployee(targetId, {
          firstName: `Updated${i}`,
          position: `Position${i}`
        });
      }
      
      const updateTime = performance.now() - startTime;
      expect(updateTime).to.be.lessThan(1000);
      
      const updatedEmployee = EmployeeService.getEmployeeById(targetId);
      expect(updatedEmployee.firstName).to.equal('Updated99');
    });
  });

  describe('concurrent operations', () => {
    it('should handle multiple simultaneous operations', () => {
      const results = [];
      
      for (let i = 0; i < 10; i++) {
        const employee = EmployeeService.addEmployee({
          firstName: `Concurrent${i}`,
          lastName: `Test${i}`,
          email: `concurrent${i}@example.com`,
          position: 'Developer',
          department: 'Engineering'
        });
        results.push(employee);
      }
      
      expect(results).to.have.lengthOf(10);
      results.forEach((employee, index) => {
        expect(employee.firstName).to.equal(`Concurrent${index}`);
        expect(employee.id).to.be.a('string');
      });
      
      const allEmployees = EmployeeService.getAllEmployees();
      expect(allEmployees).to.have.lengthOf(13);
    });

    it('should handle alternating save and delete operations', () => {
      const initialCount = EmployeeService.getAllEmployees().length;
      
      const employees = [];
      for (let i = 0; i < 5; i++) {
        const employee = EmployeeService.addEmployee({
          firstName: `Test${i}`,
          lastName: `User${i}`,
          email: `test${i}@example.com`,
          position: 'Developer',
          department: 'Engineering'
        });
        employees.push(employee);
      }
      
      for (let i = 0; i < 3; i++) {
        EmployeeService.deleteEmployee(employees[i].id);
      }
      
      const finalEmployees = EmployeeService.getAllEmployees();
      expect(finalEmployees).to.have.lengthOf(initialCount + 2);
      
      const remainingEmployees = finalEmployees.filter(emp => 
        employees.slice(3).some(addedEmp => addedEmp.id === emp.id)
      );
      expect(remainingEmployees).to.have.lengthOf(2);
    });
  });
});
