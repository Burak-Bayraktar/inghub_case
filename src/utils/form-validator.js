import { msg } from '@lit/localize';

export class FormValidator {
  static validateEmployeeForm(formData) {
    const errors = {};

    if (!formData.firstName || formData.firstName.trim() === '') {
      errors.firstName = msg('First Name is required');
    } else if (!this._isValidName(formData.firstName)) {
      errors.firstName = msg('First Name must contain only letters and be 2-50 characters long');
    }

    if (!formData.lastName || formData.lastName.trim() === '') {
      errors.lastName = msg('Last Name is required');
    } else if (!this._isValidName(formData.lastName)) {
      errors.lastName = msg('Last Name must contain only letters and be 2-50 characters long');
    }

    if (!formData.email || formData.email.trim() === '') {
      errors.email = msg('Email is required');
    } else if (!this._isValidEmail(formData.email)) {
      errors.email = msg('Please enter a valid email address');
    }

    if (!formData.phone || formData.phone.trim() === '') {
      errors.phone = msg('Phone is required');
    } else if (!this._isValidPhone(formData.phone)) {
      errors.phone = msg('Please enter a valid phone number');
    }

    if (!formData.department || formData.department.trim() === '') {
      errors.department = msg('Department is required');
    } else if (!['Analytics', 'Tech'].includes(formData.department)) {
      errors.department = msg('Department must be one of: Analytics, Tech');
    }

    if (!formData.position || formData.position.trim() === '') {
      errors.position = msg('Position is required');
    } else if (!['Junior', 'Medior', 'Senior'].includes(formData.position)) {
      errors.position = msg('Position must be one of: Junior, Medior, Senior');
    }

    if (!formData.dateOfEmployment || formData.dateOfEmployment.trim() === '') {
      errors.dateOfEmployment = msg('Date of Employment is required');
    } else if (!this._isValidDate(formData.dateOfEmployment)) {
      errors.dateOfEmployment = msg('Please enter a valid Date of Employment');
    }

    if (formData.dateOfBirth && formData.dateOfBirth.trim() !== '') {
      if (!this._isValidDate(formData.dateOfBirth)) {
        errors.dateOfBirth = msg('Please enter a valid Date of Birth');
      } else if (this._isFutureDate(formData.dateOfBirth)) {
        errors.dateOfBirth = msg('Date of birth cannot be in the future');
      } else if (this._isTooOld(formData.dateOfBirth)) {
        errors.dateOfBirth = msg('Please enter a valid date of birth');
      }
    }

    return errors;
  }

  static _isValidName(value) {
    if (!value || value.length < 2 || value.length > 50) return false;
    const nameRegex = /^[a-zA-ZÀ-ÿğĞıİöÖüÜşŞçÇ\s'-]+$/;
    return nameRegex.test(value);
  }

  static _isValidEmail(value) {
    if (!value) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) && value.length <= 254;
  }

  static _isValidPhone(value) {
    if (!value) return false;
    const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
    return phoneRegex.test(value);
  }

  static _isValidDate(value) {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  }

  static _isFutureDate(value) {
    const date = new Date(value);
    const today = new Date();
    return date > today;
  }

  static _isTooOld(value) {
    const date = new Date(value);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 100);
    return date < minDate;
  }

  static getValidationOptions() {
    return {
      departments: [
        { value: 'Analytics', label: msg('Analytics') },
        { value: 'Tech', label: msg('Tech') }
      ],
      positions: [
        { value: 'Junior', label: msg('Junior') },
        { value: 'Medior', label: msg('Medior') },
        { value: 'Senior', label: msg('Senior') }
      ]
    };
  }
}
