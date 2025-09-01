import { html, fixture, expect } from '@open-wc/testing';
import { EmployeeTableView } from '../src/components/employee-table-view.js';

describe('EmployeeTableView', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<employee-table-view></employee-table-view>`);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(EmployeeTableView);
    });

    it('should have default properties', () => {
      expect(element.employees).to.equal('[]');
      expect(element.selectedEmployees).to.equal('[]');
    });

    it('should parse employees JSON correctly', () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      
      expect(element.employeeList).to.be.an('array');
      expect(element.employeeList.length).to.equal(1);
      expect(element.employeeList[0].name).to.equal('John Doe');
    });
  });

  describe('employee rendering', () => {
    it('should render empty grid when no employees', async () => {
      await element.updateComplete;
      const gridView = element.shadowRoot.querySelector('.grid-view');
      expect(gridView).to.exist;
      expect(gridView.children.length).to.equal(0);
    });

    it('should render employee cards when employees exist', async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      await element.updateComplete;

      const employeeCards = element.shadowRoot.querySelectorAll('.employee-card');
      expect(employeeCards.length).to.equal(1);
    });

    it('should display employee information correctly', async () => {
      const employee = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        position: 'Developer',
        department: 'IT',
        phone: '+1234567890',
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20'
      };
      
      element.employees = JSON.stringify([employee]);
      await element.updateComplete;

      const employeeCard = element.shadowRoot.querySelector('.employee-card');
      expect(employeeCard.textContent).to.include('John');
      expect(employeeCard.textContent).to.include('Doe');
      expect(employeeCard.textContent).to.include('john.doe@example.com');
      expect(employeeCard.textContent).to.include('Developer');
      expect(employeeCard.textContent).to.include('IT');
    });
  });

  describe('employee actions', () => {
    beforeEach(async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      await element.updateComplete;
    });

    it('should emit employee-edit event when edit button clicked', async () => {
      let eventFired = false;
      let eventEmployee = null;

      element.addEventListener('employee-edit', (e) => {
        eventFired = true;
        eventEmployee = e.detail.employee;
      });

      const editButton = element.shadowRoot.querySelector('.edit-btn');
      editButton.click();

      expect(eventFired).to.be.true;
      expect(eventEmployee.name).to.equal('John Doe');
    });

    it('should emit employee-delete event when delete button clicked', async () => {
      let eventFired = false;
      let eventEmployee = null;

      element.addEventListener('employee-delete', (e) => {
        eventFired = true;
        eventEmployee = e.detail.employee;
      });

      const deleteButton = element.shadowRoot.querySelector('.delete-btn');
      deleteButton.click();

      expect(eventFired).to.be.true;
      expect(eventEmployee.name).to.equal('John Doe');
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      element.employees = 'invalid json';
      await element.updateComplete;
      
      expect(element.employeeList).to.be.an('array');
      expect(element.employeeList.length).to.equal(0);
      
      const gridView = element.shadowRoot.querySelector('.grid-view');
      expect(gridView.children.length).to.equal(0);
    });

    it('should handle null employees property', async () => {
      element.employees = null;
      await element.updateComplete;
      
      expect(element.employeeList).to.be.an('array');
      expect(element.employeeList.length).to.equal(0);
      
      const gridView = element.shadowRoot.querySelector('.grid-view');
      expect(gridView.children.length).to.equal(0);
    });

    it('should handle undefined employees property', async () => {
      element.employees = undefined;
      await element.updateComplete;
      
      expect(element.employeeList).to.be.an('array');
      expect(element.employeeList.length).to.equal(0);
    });

    it('should handle invalid selectedEmployees JSON gracefully', async () => {
      element.selectedEmployees = 'invalid json';
      await element.updateComplete;
      
      expect(element.selectedEmployeeList).to.be.an('array');
      expect(element.selectedEmployeeList.length).to.equal(0);
    });

    it('should handle employees with missing properties', async () => {
      element.employees = JSON.stringify([
        {
          id: 1
        },
        {
          id: 2,
          name: 'Jane Doe'
        }
      ]);
      await element.updateComplete;

      const employeeCards = element.shadowRoot.querySelectorAll('.employee-card');
      expect(employeeCards.length).to.equal(2);
    });

    it('should handle empty string properties', async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: '',
          email: '',
          position: '',
          department: '',
          phone: '',
          dateOfEmployment: '',
          dateOfBirth: ''
        }
      ]);
      await element.updateComplete;

      const employeeCards = element.shadowRoot.querySelectorAll('.employee-card');
      expect(employeeCards.length).to.equal(1);
    });

    it('should handle employees with special characters in data', async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'José María',
          email: 'josé.maría@example.com',
          position: 'Senior Developer & Tech Lead',
          department: 'R&D',
          phone: '+1-234-567-890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      await element.updateComplete;

      const employeeCard = element.shadowRoot.querySelector('.employee-card');
      expect(employeeCard.textContent).to.include('José');
      expect(employeeCard.textContent).to.include('María');
      expect(employeeCard.textContent).to.include('josé.maría@example.com');
    });

    it('should handle large number of employees', async () => {
      const employees = Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        name: `Employee ${i + 1}`,
        email: `employee${i + 1}@example.com`,
        position: 'Developer',
        department: 'IT',
        phone: `+123456789${i}`,
        dateOfEmployment: '2023-01-15',
        dateOfBirth: '1990-05-20'
      }));

      element.employees = JSON.stringify(employees);
      await element.updateComplete;

      const employeeCards = element.shadowRoot.querySelectorAll('.employee-card');
      expect(employeeCards.length).to.equal(50);
    });
  });

  describe('selection handling', () => {
    beforeEach(async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          position: 'Manager',
          department: 'HR',
          phone: '+1234567891',
          dateOfEmployment: '2023-02-15',
          dateOfBirth: '1985-03-10'
        }
      ]);
      await element.updateComplete;
    });

    it('should handle selected employees correctly', async () => {
      element.selectedEmployees = JSON.stringify([1]);
      await element.updateComplete;

      expect(element.selectedEmployeeList).to.be.an('array');
      expect(element.selectedEmployeeList.length).to.equal(1);
      expect(element.selectedEmployeeList[0]).to.equal(1);
    });

    it('should handle multiple selected employees', async () => {
      element.selectedEmployees = JSON.stringify([1, 2]);
      await element.updateComplete;

      expect(element.selectedEmployeeList.length).to.equal(2);
      expect(element.selectedEmployeeList).to.include(1);
      expect(element.selectedEmployeeList).to.include(2);
    });

    it('should handle empty selection', async () => {
      element.selectedEmployees = JSON.stringify([]);
      await element.updateComplete;

      expect(element.selectedEmployeeList).to.be.an('array');
      expect(element.selectedEmployeeList.length).to.equal(0);
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      await element.updateComplete;
    });

    it('should have proper button accessibility attributes', () => {
      const editButtons = element.shadowRoot.querySelectorAll('[data-action="edit"]');
      const deleteButtons = element.shadowRoot.querySelectorAll('[data-action="delete"]');

      editButtons.forEach(button => {
        expect(button.getAttribute('aria-label')).to.exist;
      });

      deleteButtons.forEach(button => {
        expect(button.getAttribute('aria-label')).to.exist;
      });
    });

    it('should have proper keyboard navigation support', () => {
      const actionButtons = element.shadowRoot.querySelectorAll('.action-btn');
      
      actionButtons.forEach(button => {
        expect(button.tabIndex).to.not.equal(-1);
      });
    });
  });

  describe('responsive behavior', () => {
    it('should handle different viewport sizes', async () => {
      element.employees = JSON.stringify([
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+1234567890',
          dateOfEmployment: '2023-01-15',
          dateOfBirth: '1990-05-20'
        }
      ]);
      await element.updateComplete;

      const gridView = element.shadowRoot.querySelector('.grid-view');
      expect(gridView).to.exist;
      
      const computedStyle = window.getComputedStyle(gridView);
      expect(computedStyle.display).to.equal('grid');
    });
  });
});
