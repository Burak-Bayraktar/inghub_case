import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';
import {AppRouter} from './app-router.js';
import {FormValidator} from '../utils/form-validator.js';
import {EmployeeService} from '../services/employee-service.js';
import './page-title.js';

export class ItemForm extends LocalizedComponent {
  static styles = css`
    :host {
      display: block;
      padding: 0 24px;
    }

    .card {
      background: rgb(248, 249, 250);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    form {
      padding: 32px;
      flex: 1;
      overflow-y: auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      font-weight: 500;
      color: #374151;
      font-size: 14px;
    }

    .form-input {
      padding: 12px 16px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 3px rgba(255, 98, 0, 0.1);
    }

    .form-input.error {
      border-color: #dc2626;
      box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    }

    .form-error {
      color: #dc2626;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    .form-success {
      color: #059669;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }

    select.form-input {
      cursor: pointer;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
    }

    .btn-secondary {
      background: #f3f4f6;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #e5e7eb;
    }

    .btn-primary {
      background: #ff6200;
      color: white;
    }

    .btn-primary:hover {
      background: #e55100;
    }

    @media (max-width: 768px) {
      :host {
        padding: 0 16px;
      }

      .form-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      form {
        padding: 24px;
      }

      .actions {
        flex-direction: column-reverse;
      }

      .btn {
        width: 100%;
      }
    }
  `;

  static properties = {
    employeeId: {type: String},
    firstName: {type: String, state: true},
    lastName: {type: String, state: true},
    email: {type: String, state: true},
    phone: {type: String, state: true},
    department: {type: String, state: true},
    position: {type: String, state: true},
    dateOfEmployment: {type: String, state: true},
    dateOfBirth: {type: String, state: true},
    isEdit: {type: Boolean},
    validationErrors: {type: Object, state: true},
  };

  constructor() {
    super();
    this.employeeId = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.department = '';
    this.position = '';
    this.dateOfEmployment = '';
    this.dateOfBirth = '';
    this.isEdit = false;
    this.validationErrors = {};
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);

    if (
      changedProperties.has('isEdit') ||
      changedProperties.has('employeeId')
    ) {
      if (this.isEdit && this.employeeId) {
        this._loadEmployeeData(this.employeeId);
      } else if (!this.isEdit) {
        this._resetForm();
      }
    }
  }

  _validateField(fieldName, value) {
    const tempData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      department: this.department,
      position: this.position,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
    };
    
    tempData[fieldName] = value;
    
    const allErrors = FormValidator.validateEmployeeForm(tempData);
    
    const errors = {...this.validationErrors};
    if (allErrors[fieldName]) {
      errors[fieldName] = allErrors[fieldName];
    } else {
      delete errors[fieldName];
    }

    this.validationErrors = errors;
  }

  _validateAllFields() {
    const formData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      department: this.department,
      position: this.position,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth,
    };

    this.validationErrors = FormValidator.validateEmployeeForm(formData);

    return Object.keys(this.validationErrors).length === 0;
  }

  _onInputChange(fieldName, value) {
    this[fieldName] = value;
    this._validateField(fieldName, value);
  }

  _resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.department = '';
    this.position = '';
    this.dateOfBirth = '';
    this.validationErrors = {};

    const today = new Date().toISOString().split('T')[0];
    this.dateOfEmployment = today;
  }

  _loadEmployeeData(employeeId) {
    const employee = EmployeeService.getEmployeeById(employeeId);
    if (employee) {
      this.firstName = employee.firstName || '';
      this.lastName = employee.lastName || '';
      this.email = employee.email || '';
      this.phone = employee.phone || '';
      this.department = employee.dept || '';  // dept -> department
      this.position = employee.position || '';
      this.dateOfEmployment = this._convertDateFormat(employee.doe) || '';  // doe -> dateOfEmployment
      this.dateOfBirth = this._convertDateFormat(employee.dob) || '';  // dob -> dateOfBirth
    }
  }

  _convertDateFormat(dateString) {
    if (!dateString) return '';

    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
  }

  onSubmit(e) {
    e.preventDefault();

    const isValid = this._validateAllFields();

    if (!isValid) {
      alert(msg('Please fix all validation errors before submitting'));
      return;
    }

    const employeeData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      dept: this.department, // Convert to match Redux store format
      position: this.position,
      doe: this._convertDateForSave(this.dateOfEmployment), // Convert to DD/MM/YYYY
      dob: this._convertDateForSave(this.dateOfBirth), // Convert to DD/MM/YYYY
    };

    try {
      if (this.isEdit) {
        EmployeeService.updateEmployee(this.employeeId, employeeData);
        alert(msg('Employee updated successfully'));
      } else {
        EmployeeService.addEmployee(employeeData);
        alert(msg('Employee created successfully'));
      }
      AppRouter.navigate('/');
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('An error occurred while saving the employee.');
    }
  }

  _convertDateForSave(dateString) {
    if (!dateString) return '';
    // Convert from YYYY-MM-DD to DD/MM/YYYY format for storage
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  }

  render() {
    return html`
      <page-title .title=${this.isEdit ? msg('Edit Employee') : msg('Add Employee')}></page-title>

      <div class="card">
        ${this.isEdit && this.firstName && this.lastName ? html`
          <div style="padding: 16px 32px 0 32px; color: #6c757d; font-size: 14px;">
            ${msg('You are editing')} ${this.firstName} ${this.lastName}
          </div>
        ` : ''}
        <form @submit=${this.onSubmit}>
          <div class="form-grid">
            <div class="form-field">
              <label class="form-label">${msg('First Name')} *</label>
              <input
                type="text"
                class="form-input ${this.validationErrors.firstName
                  ? 'error'
                  : ''}"
                .value=${this.firstName}
                @input=${(e) =>
                  this._onInputChange('firstName', e.target.value)}
                required
                placeholder="${msg('Enter first name')}"
              />
              ${this.validationErrors.firstName
                ? html`<span class="form-error"
                    >${this.validationErrors.firstName}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Last Name')} *</label>
              <input
                type="text"
                class="form-input ${this.validationErrors.lastName
                  ? 'error'
                  : ''}"
                .value=${this.lastName}
                @input=${(e) => this._onInputChange('lastName', e.target.value)}
                required
                placeholder="${msg('Enter last name')}"
              />
              ${this.validationErrors.lastName
                ? html`<span class="form-error"
                    >${this.validationErrors.lastName}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Email')} *</label>
              <input
                type="email"
                class="form-input ${this.validationErrors.email ? 'error' : ''}"
                .value=${this.email}
                @input=${(e) => this._onInputChange('email', e.target.value)}
                required
                placeholder="${msg('Enter email address')}"
              />
              ${this.validationErrors.email
                ? html`<span class="form-error"
                    >${this.validationErrors.email}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Phone')} *</label>
              <input
                type="tel"
                class="form-input ${this.validationErrors.phone ? 'error' : ''}"
                .value=${this.phone}
                @input=${(e) => this._onInputChange('phone', e.target.value)}
                required
                placeholder="${msg('Enter phone number (e.g., +90 532 123 45 67)')}"
              />
              ${this.validationErrors.phone
                ? html`<span class="form-error"
                    >${this.validationErrors.phone}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Department')} *</label>
              <select
                class="form-input ${this.validationErrors.department
                  ? 'error'
                  : ''}"
                .value=${this.department}
                @change=${(e) =>
                  this._onInputChange('department', e.target.value)}
                required
              >
                <option value="">${msg('Select department')}</option>
                <option value="Analytics">Analytics</option>
                <option value="Tech">Tech</option>
              </select>
              ${this.validationErrors.department
                ? html`<span class="form-error"
                    >${this.validationErrors.department}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Position')} *</label>
              <select
                class="form-input ${this.validationErrors.position
                  ? 'error'
                  : ''}"
                .value=${this.position}
                @change=${(e) =>
                  this._onInputChange('position', e.target.value)}
                required
              >
                <option value="">${msg('Select position')}</option>
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
              ${this.validationErrors.position
                ? html`<span class="form-error"
                    >${this.validationErrors.position}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Date of Employment')} *</label>
              <input
                type="date"
                class="form-input ${this.validationErrors.dateOfEmployment
                  ? 'error'
                  : ''}"
                .value=${this.dateOfEmployment}
                @input=${(e) =>
                  this._onInputChange('dateOfEmployment', e.target.value)}
                required
              />
              ${this.validationErrors.dateOfEmployment
                ? html`<span class="form-error"
                    >${this.validationErrors.dateOfEmployment}</span
                  >`
                : ''}
            </div>

            <div class="form-field">
              <label class="form-label">${msg('Date of Birth')}</label>
              <input
                type="date"
                class="form-input ${this.validationErrors.dateOfBirth
                  ? 'error'
                  : ''}"
                .value=${this.dateOfBirth}
                @input=${(e) =>
                  this._onInputChange('dateOfBirth', e.target.value)}
              />
              ${this.validationErrors.dateOfBirth
                ? html`<span class="form-error"
                    >${this.validationErrors.dateOfBirth}</span
                  >`
                : ''}
            </div>
          </div>

          <div class="actions">
            <button
              type="button"
              class="btn btn-secondary"
              @click=${() => AppRouter.navigate('/')}
            >
              ${msg('Cancel')}
            </button>
            <button type="submit" class="btn btn-primary">
              ${this.isEdit ? msg('Update Employee') : msg('Create Employee')}
            </button>
          </div>
        </form>
      </div>
    `;
  }
}

customElements.define('item-form', ItemForm);
