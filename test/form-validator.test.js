import { expect } from '@open-wc/testing';
import { FormValidator } from '../src/utils/form-validator.js';

describe('FormValidator', () => {
  const validEmployee = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+90 532 123 45 67',
    department: 'Tech',
    position: 'Senior',
    dateOfEmployment: '2023-01-01',
    dateOfBirth: '1990-05-15'
  };

  it('should return no errors for valid employee data', () => {
    const errors = FormValidator.validateEmployeeForm(validEmployee);
    expect(Object.keys(errors)).to.have.length(0);
  });

  describe('firstName validation', () => {
    it('should require firstName', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, firstName: '' });
      expect(errors.firstName).to.exist;
    });

    it('should reject firstName with numbers', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, firstName: 'John123' });
      expect(errors.firstName).to.exist;
    });

    it('should reject firstName that is too short', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, firstName: 'J' });
      expect(errors.firstName).to.exist;
    });

    it('should reject firstName that is too long', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, firstName: 'J'.repeat(51) });
      expect(errors.firstName).to.exist;
    });

    it('should accept firstName with Turkish characters', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, firstName: 'Müslüm' });
      expect(errors.firstName).to.not.exist;
    });
  });

  describe('lastName validation', () => {
    it('should require lastName', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, lastName: '' });
      expect(errors.lastName).to.exist;
    });

    it('should reject lastName with numbers', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, lastName: 'Doe123' });
      expect(errors.lastName).to.exist;
    });
  });

  describe('email validation', () => {
    it('should require email', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, email: '' });
      expect(errors.email).to.exist;
    });

    it('should reject invalid email format', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, email: 'invalid-email' });
      expect(errors.email).to.exist;
    });

    it('should accept valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@company.org',
        'email@123.123.123.123',
        'email@[123.123.123.123]'
      ];
      
      validEmails.forEach(email => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, email });
        expect(errors.email).to.not.exist;
      });
    });
  });

  describe('phone validation', () => {
    it('should require phone', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, phone: '' });
      expect(errors.phone).to.exist;
    });

    it('should accept valid Turkish phone formats', () => {
      const validPhones = [
        '+90 532 123 45 67',
        '0532 123 45 67',
        '532 123 45 67',
        '5321234567',
        '+905321234567',
        '0 532 123 45 67'
      ];
      
      validPhones.forEach(phone => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, phone });
        expect(errors.phone).to.not.exist;
      });
    });

    it('should reject invalid phone formats', () => {
      const invalidPhones = [
        '123',
        'abc123',
        '+1 234 567 8901',
        '123-456-7890',
        '0532 123 45',
        '+90 532 123',
        '+90 123 456 78 90'
      ];
      
      invalidPhones.forEach(phone => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, phone });
        expect(errors.phone).to.exist;
      });
    });
  });

  describe('department validation', () => {
    it('should require department', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, department: '' });
      expect(errors.department).to.exist;
    });

    it('should accept valid departments', () => {
      const validDepartments = ['Tech', 'Analytics'];
      
      validDepartments.forEach(department => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, department });
        expect(errors.department).to.not.exist;
      });
    });

    it('should reject invalid departments', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, department: 'InvalidDept' });
      expect(errors.department).to.exist;
    });
  });

  describe('position validation', () => {
    it('should require position', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, position: '' });
      expect(errors.position).to.exist;
    });

    it('should accept valid positions', () => {
      const validPositions = ['Junior', 'Medior', 'Senior'];
      
      validPositions.forEach(position => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, position });
        expect(errors.position).to.not.exist;
      });
    });

    it('should reject invalid positions', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, position: 'InvalidPosition' });
      expect(errors.position).to.exist;
    });
  });

  describe('date validation', () => {
    it('should require dateOfEmployment', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, dateOfEmployment: '' });
      expect(errors.dateOfEmployment).to.exist;
    });

    it('should accept valid date formats', () => {
      const validDates = ['2023-01-01', '2022-12-31', '2024-06-15'];
      
      validDates.forEach(dateOfEmployment => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, dateOfEmployment });
        expect(errors.dateOfEmployment).to.not.exist;
      });
    });

    it('should reject invalid date formats', () => {
      const invalidDates = ['invalid-date', '32/01/2023', '2023/13/45', 'not-a-date'];
      
      invalidDates.forEach(dateOfEmployment => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, dateOfEmployment });
        expect(errors.dateOfEmployment).to.exist;
      });
    });

    it('should not require dateOfBirth when empty', () => {
      const errors = FormValidator.validateEmployeeForm({ ...validEmployee, dateOfBirth: '' });
      expect(errors.dateOfBirth).to.not.exist;
    });

    it('should accept valid birth date formats', () => {
      const validDates = ['1990-05-15', '1985-01-01', '2000-12-31'];
      
      validDates.forEach(dateOfBirth => {
        const errors = FormValidator.validateEmployeeForm({ ...validEmployee, dateOfBirth });
        expect(errors.dateOfBirth).to.not.exist;
      });
    });
  });

  describe('error messages', () => {
    it('should return localized error messages', () => {
      const errors = FormValidator.validateEmployeeForm({});
      
      expect(errors.firstName).to.be.a('string');
      expect(errors.lastName).to.be.a('string');
      expect(errors.email).to.be.a('string');
      expect(errors.phone).to.be.a('string');
    });

    it('should handle mixed valid and invalid fields', () => {
      const mixedData = {
        firstName: 'John',
        lastName: '',
        email: 'invalid-email',
        phone: '+90 532 123 45 67',
        department: 'Tech',
        position: 'InvalidPosition',
        dateOfEmployment: '2023-01-01',
        dateOfBirth: ''
      };

      const errors = FormValidator.validateEmployeeForm(mixedData);
      
      expect(errors.firstName).to.not.exist;
      expect(errors.lastName).to.exist;
      expect(errors.email).to.exist;
      expect(errors.phone).to.not.exist;
      expect(errors.department).to.not.exist;
      expect(errors.position).to.exist;
      expect(errors.dateOfEmployment).to.not.exist;
      expect(errors.dateOfBirth).to.not.exist;
    });
  });
});
