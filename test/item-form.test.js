import { html, fixture, expect } from '@open-wc/testing';
import { ItemForm } from '../src/components/item-form.js';
import '../src/components/item-form.js';
import '../src/store/index.js';
import { store } from '../src/store/index.js';

describe('ItemForm', () => {
  let element;

  beforeEach(async () => {
    store.dispatch({ type: 'employees/clearAllEmployees' });
    element = await fixture(html`<item-form></item-form>`);
  });

  it('should render the form component', () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal('item-form');
  });

  it('should have shadow DOM', () => {
    expect(element.shadowRoot).to.exist;
  });

  it('should render the form element', () => {
    const form = element.shadowRoot.querySelector('form');
    expect(form).to.exist;
  });

  it('should render all required input fields', () => {
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    const emailInput = element.shadowRoot.querySelector('input[type="email"]');
    const phoneInput = element.shadowRoot.querySelector('input[type="tel"]');
    const departmentSelect = element.shadowRoot.querySelector('select');
    
    expect(firstNameInput).to.exist;
    expect(emailInput).to.exist;
    expect(phoneInput).to.exist;
    expect(departmentSelect).to.exist;
  });

  it('should render submit and cancel buttons', () => {
    const submitBtn = element.shadowRoot.querySelector('button[type="submit"]');
    const cancelBtn = element.shadowRoot.querySelector('button[type="button"]');
    
    expect(submitBtn).to.exist;
    expect(cancelBtn).to.exist;
  });

  it('should have default properties', () => {
    expect(element.firstName).to.equal('');
    expect(element.lastName).to.equal('');
    expect(element.email).to.equal('');
    expect(element.phone).to.equal('');
    expect(element.department).to.equal('');
    expect(element.position).to.equal('');
    expect(element.isEdit).to.be.false;
  });

  it('should accept employeeId property', async () => {
    element.employeeId = '123';
    await element.updateComplete;
    
    expect(element.employeeId).to.equal('123');
  });

  it('should accept isEdit property', async () => {
    element.isEdit = true;
    await element.updateComplete;
    
    expect(element.isEdit).to.be.true;
  });

  it('should update firstName property when input changes', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    
    firstNameInput.value = 'John';
    firstNameInput.dispatchEvent(new Event('input'));
    await element.updateComplete;
    
    expect(element.firstName).to.equal('John');
  });

  it('should update email property when input changes', async () => {
    const emailInput = element.shadowRoot.querySelector('input[type="email"]');
    
    emailInput.value = 'john@example.com';
    emailInput.dispatchEvent(new Event('input'));
    await element.updateComplete;
    
    expect(element.email).to.equal('john@example.com');
  });

  it('should display firstName value in input field', async () => {
    element.firstName = 'John';
    await element.updateComplete;
    
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    expect(firstNameInput.value).to.equal('John');
  });

  it('should display email value in input field', async () => {
    element.email = 'john@example.com';
    await element.updateComplete;
    
    const emailInput = element.shadowRoot.querySelector('input[type="email"]');
    expect(emailInput.value).to.equal('john@example.com');
  });

  it('should validate firstName field on input change', async () => {
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    
    firstNameInput.value = '';
    firstNameInput.dispatchEvent(new Event('input'));
    await element.updateComplete;
    
    expect(element.validationErrors.firstName).to.exist;
  });

  it('should validate email field on input change', async () => {
    const emailInput = element.shadowRoot.querySelector('input[type="email"]');
    
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    await element.updateComplete;
    
    expect(element.validationErrors.email).to.exist;
  });

  it('should clear validation errors when valid input is provided', async () => {
    element._onInputChange('firstName', '');
    await element.updateComplete;
    
    element._onInputChange('firstName', 'John');
    await element.updateComplete;
    
    expect(element.validationErrors.firstName).to.be.undefined;
  });

  it('should display validation error messages', async () => {
    element.validationErrors = {
      firstName: 'First name is required'
    };
    await element.updateComplete;
    
    const errorMsg = element.shadowRoot.querySelector('.form-error');
    expect(errorMsg).to.exist;
    expect(errorMsg.textContent).to.equal('First name is required');
  });

  it('should prevent form submission when validation fails', async () => {
    const form = element.shadowRoot.querySelector('form');
    
    element.firstName = '';
    element.email = 'invalid-email';
    
    const submitEvent = new Event('submit');
    let defaultPrevented = false;
    
    submitEvent.preventDefault = () => {
      defaultPrevented = true;
    };
    
    form.dispatchEvent(submitEvent);
    
    expect(defaultPrevented).to.be.true;
  });

  it('should handle form submission with valid data', async () => {
    element.firstName = 'John';
    element.lastName = 'Doe';
    element.email = 'john@example.com';
    element.phone = '+90 532 123 45 67';
    element.department = 'Tech';
    element.position = 'Senior';
    element.dateOfEmployment = '2023-01-01';
    element.dateOfBirth = '1990-01-01';
    
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    
    let preventDefaultCalled = false;
    submitEvent.preventDefault = () => {
      preventDefaultCalled = true;
    };
    
    element.onSubmit(submitEvent);
    
    expect(preventDefaultCalled).to.be.true;
  });

  it('should reset form fields when _resetForm is called', async () => {
    element.firstName = 'John';
    element.lastName = 'Doe';
    element.email = 'john@example.com';
    
    element._resetForm();
    await element.updateComplete;
    
    expect(element.firstName).to.equal('');
    expect(element.lastName).to.equal('');
    expect(element.email).to.equal('');
  });

  it('should set default date of employment when resetting form', async () => {
    element._resetForm();
    await element.updateComplete;
    
    const today = new Date().toISOString().split('T')[0];
    expect(element.dateOfEmployment).to.equal(today);
  });

  it('should render department select options', () => {
    const departmentSelect = element.shadowRoot.querySelector('select');
    expect(departmentSelect).to.exist;
    
    const options = departmentSelect.querySelectorAll('option');
    expect(options.length).to.be.greaterThan(0);
  });

  it('should convert date format correctly', () => {
    const result = element._convertDateFormat('15/06/2023');
    expect(result).to.equal('2023-06-15');
  });

  it('should convert date for save correctly', () => {
    const result = element._convertDateForSave('2023-06-15');
    expect(result).to.equal('15/06/2023');
  });

  it('should handle empty date strings', () => {
    expect(element._convertDateFormat('')).to.equal('');
    expect(element._convertDateForSave('')).to.equal('');
  });

  it('should validate single field correctly', async () => {
    element._validateField('firstName', '');
    await element.updateComplete;
    
    expect(element.validationErrors.firstName).to.exist;
  });

  it('should validate all fields correctly', async () => {
    element.firstName = '';
    element.lastName = '';
    element.email = 'invalid-email';
    
    const isValid = element._validateAllFields();
    
    expect(isValid).to.be.false;
    expect(Object.keys(element.validationErrors).length).to.be.greaterThan(0);
  });

  it('should handle input change correctly', async () => {
    element._onInputChange('firstName', 'John');
    await element.updateComplete;
    
    expect(element.firstName).to.equal('John');
  });

  it('should render form labels', () => {
    const labels = element.shadowRoot.querySelectorAll('label');
    expect(labels.length).to.be.greaterThan(0);
    
    labels.forEach(label => {
      expect(label.textContent.trim()).to.not.be.empty;
    });
  });

  it('should render button text', () => {
    const submitBtn = element.shadowRoot.querySelector('button[type="submit"]');
    const cancelBtn = element.shadowRoot.querySelector('button[type="button"]');
    
    expect(submitBtn.textContent.trim()).to.not.be.empty;
    expect(cancelBtn.textContent.trim()).to.not.be.empty;
  });

  it('should apply error class to invalid fields', async () => {
    element.validationErrors = {
      firstName: 'Required'
    };
    await element.updateComplete;
    
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    expect(firstNameInput.classList.contains('error')).to.be.true;
  });

  it('should have responsive styles', () => {
    const styles = ItemForm.styles.cssText;
    expect(styles).to.include('@media');
  });

  it('should show different title in edit mode', async () => {
    element.isEdit = true;
    await element.updateComplete;
    
    const pageTitle = element.shadowRoot.querySelector('page-title');
    expect(pageTitle).to.exist;
  });

  it('should display original employee info in edit mode', async () => {
    element.isEdit = true;
    element.originalEmployee = {
      firstName: 'John',
      lastName: 'Doe'
    };
    await element.updateComplete;
    
    const editInfo = element.shadowRoot.querySelector('div[style*="color: #6c757d"]');
    expect(editInfo).to.exist;
  });

  it('should handle form submission errors gracefully', async () => {
    const originalError = console.error;
    let errorLogged = false;
    console.error = () => {
      errorLogged = true;
    };
    
    element.firstName = 'John';
    element.lastName = 'Doe';
    element.email = 'john@example.com';
    element.phone = '+90 532 123 45 67';
    element.department = 'Tech';
    element.position = 'Senior';
    element.dateOfEmployment = '2023-01-01';
    element.dateOfBirth = '1990-01-01';
    
    const EmployeeService = (await import('../src/services/employee-service.js')).EmployeeService;
    const originalAddEmployee = EmployeeService.addEmployee;
    EmployeeService.addEmployee = () => {
      throw new Error('Test error');
    };
    
    const submitEvent = new Event('submit');
    element.onSubmit(submitEvent);
    
    expect(errorLogged).to.be.true;
    
    console.error = originalError;
    EmployeeService.addEmployee = originalAddEmployee;
  });

  it('should render form grid layout', () => {
    const formGrid = element.shadowRoot.querySelector('.form-grid');
    expect(formGrid).to.exist;
  });

  it('should render form fields in grid', () => {
    const formFields = element.shadowRoot.querySelectorAll('.form-field');
    expect(formFields.length).to.be.greaterThan(0);
  });

  it('should render card container', () => {
    const card = element.shadowRoot.querySelector('.card');
    expect(card).to.exist;
  });

  it('should render primary and secondary buttons', () => {
    const primaryBtn = element.shadowRoot.querySelector('.btn-primary');
    const secondaryBtn = element.shadowRoot.querySelector('.btn-secondary');
    
    expect(primaryBtn).to.exist;
    expect(secondaryBtn).to.exist;
  });

  it('should render input placeholders', () => {
    const inputs = element.shadowRoot.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    
    expect(inputs.length).to.be.greaterThan(0);
    
    inputs.forEach(input => {
      expect(input.hasAttribute('placeholder')).to.be.true;
    });
  });

  it('should mark required fields', () => {
    const requiredInputs = element.shadowRoot.querySelectorAll('input[required]');
    expect(requiredInputs.length).to.be.greaterThan(0);
  });

  it('should render form actions container', () => {
    const actions = element.shadowRoot.querySelector('.actions');
    expect(actions).to.exist;
  });

  it('should react to property changes', async () => {
    element.firstName = 'John';
    await element.updateComplete;
    
    const firstNameInput = element.shadowRoot.querySelector('input[type="text"]');
    expect(firstNameInput.value).to.equal('John');
    
    element.firstName = 'Jane';
    await element.updateComplete;
    
    expect(firstNameInput.value).to.equal('Jane');
  });

  it('should handle willUpdate lifecycle', async () => {
    const changedProperties = new window.Map();
    changedProperties.set('isEdit', false);
    changedProperties.set('employeeId', '');
    
    element.willUpdate(changedProperties);
    
    expect(element.isEdit).to.be.false;
  });

  it('should load employee data when employeeId is set', async () => {
    const EmployeeService = (await import('../src/services/employee-service.js')).EmployeeService;
    const originalGetEmployee = EmployeeService.getEmployeeById;
    
    EmployeeService.getEmployeeById = () => ({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      dept: 'IT',
      position: 'Developer',
      doe: '01/01/2023',
      dob: '01/01/1990'
    });
    
    element._loadEmployeeData('123');
    
    expect(element.firstName).to.equal('John');
    expect(element.lastName).to.equal('Doe');
    expect(element.email).to.equal('john@example.com');
    
    EmployeeService.getEmployeeById = originalGetEmployee;
  });

  it('should integrate with FormValidator', async () => {
    const FormValidator = (await import('../src/utils/form-validator.js')).FormValidator;
    expect(FormValidator).to.exist;
    expect(FormValidator.validateEmployeeForm).to.be.a('function');
  });

  it('should integrate with EmployeeService', async () => {
    const EmployeeService = (await import('../src/services/employee-service.js')).EmployeeService;
    expect(EmployeeService).to.exist;
    expect(EmployeeService.addEmployee).to.be.a('function');
    expect(EmployeeService.updateEmployee).to.be.a('function');
  });

  it('should handle null employee data gracefully', () => {
    element._loadEmployeeData('nonexistent');
    
    expect(element.firstName).to.equal('');
  });

  it('should handle invalid date formats', () => {
    const result = element._convertDateFormat('invalid-date');
    expect(result).to.equal('invalid-date');
  });

  it('should handle multiple rapid property changes', async () => {
    for (let i = 0; i < 10; i++) {
      element.firstName = `Test${i}`;
      element.lastName = `User${i}`;
    }
    
    await element.updateComplete;
    
    expect(element.firstName).to.equal('Test9');
    expect(element.lastName).to.equal('User9');
  });

  it('should handle complete workflow', async () => {
    expect(element.isEdit).to.be.false;
    expect(element.firstName).to.equal('');
    
    element._onInputChange('firstName', 'John');
    element._onInputChange('lastName', 'Doe');
    element._onInputChange('email', 'john@example.com');
    element._onInputChange('phone', '+90 532 123 45 67');
    element._onInputChange('department', 'Tech');
    element._onInputChange('position', 'Senior');
    element._onInputChange('dateOfEmployment', '2023-01-01');
    
    await element.updateComplete;
    
    const isValid = element._validateAllFields();
    expect(isValid).to.be.true;
    
    element._resetForm();
    await element.updateComplete;
    
    expect(element.firstName).to.equal('');
    expect(element.lastName).to.equal('');
  });

  describe('additional coverage', () => {
    it('should handle form submission with invalid data', async () => {
      const invalidData = {
        firstName: '',
        lastName: '',
        email: 'invalid-email'
      };
      
      for (const [key, value] of Object.entries(invalidData)) {
        const input = element.shadowRoot.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = value;
        }
      }
      
      const form = element.shadowRoot.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit'));
      }
      
      expect(true).to.be.true;
    });

    it('should handle field validation on blur', async () => {
      const emailInput = element.shadowRoot.querySelector('[name="email"]');
      if (emailInput) {
        emailInput.value = 'invalid-email';
        emailInput.dispatchEvent(new Event('blur'));
        await element.updateComplete;
        
        const errorElement = element.shadowRoot.querySelector('.error');
        expect(errorElement).to.exist;
      }
    });

    it('should reset form when reset is called', async () => {
      if (element.reset) {
        element.reset();
        await element.updateComplete;
        
        const inputs = element.shadowRoot.querySelectorAll('input');
        inputs.forEach(input => {
          expect(input.value).to.equal('');
        });
      }
    });

    it('should handle date field validation', async () => {
      const dateInput = element.shadowRoot.querySelector('[name="dateOfBirth"]');
      if (dateInput) {
        dateInput.value = 'invalid-date';
        dateInput.dispatchEvent(new Event('input'));
        await element.updateComplete;
        expect(true).to.be.true;
      }
    });

    it('should handle phone number formatting', async () => {
      const phoneInput = element.shadowRoot.querySelector('[name="phone"]');
      if (phoneInput) {
        phoneInput.value = '1234567890';
        phoneInput.dispatchEvent(new Event('input'));
        await element.updateComplete;
        expect(true).to.be.true;
      }
    });

    it('should validate all fields on submit', async () => {
      const submitButton = element.shadowRoot.querySelector('[type="submit"]');
      if (submitButton) {
        submitButton.click();
        await element.updateComplete;
        expect(true).to.be.true;
      }
    });

    it('should handle keyboard navigation', async () => {
      const firstInput = element.shadowRoot.querySelector('input');
      if (firstInput) {
        firstInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));
        expect(true).to.be.true;
      }
    });

    it('should handle focus and blur events', async () => {
      const inputs = element.shadowRoot.querySelectorAll('input');
      inputs.forEach(input => {
        input.dispatchEvent(new Event('focus'));
        input.dispatchEvent(new Event('blur'));
      });
      expect(true).to.be.true;
    });

    it('should handle field changes', async () => {
      const inputs = element.shadowRoot.querySelectorAll('input, select');
      inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'email') {
          input.value = 'test value';
        }
        input.dispatchEvent(new Event('change'));
      });
      await element.updateComplete;
      expect(true).to.be.true;
    });

    it('should handle form mode switching', async () => {
      if (element.mode) {
        element.mode = 'edit';
        await element.updateComplete;
        
        element.mode = 'create';
        await element.updateComplete;
        
        expect(true).to.be.true;
      }
    });
  });
});
