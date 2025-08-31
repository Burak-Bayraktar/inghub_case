import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';
import {AppRouter} from './app-router.js';
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
  }

  willUpdate(changedProperties) {
    super.willUpdate(changedProperties);
    
    if (changedProperties.has('isEdit') || changedProperties.has('employeeId')) {
      if (this.isEdit && this.employeeId) {
        this._loadEmployeeData(this.employeeId);
      } else if (!this.isEdit) {
        this._resetForm();
      }
    }
  }

  _resetForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phone = '';
    this.department = '';
    this.position = '';
    this.dateOfBirth = '';
    
    const today = new Date().toISOString().split('T')[0];
    this.dateOfEmployment = today;
  }

  _loadEmployeeData(employeeId) {
    console.log('Loading employee data for ID:', employeeId);
    this.firstName = 'Ahmet';
    this.lastName = 'Yılmaz';
    this.email = 'ahmet.yilmaz@ing.com';
    this.phone = '+(90) 532 123 45 67';
    this.department = 'Analytics';
    this.position = 'Senior';
    this.dateOfEmployment = '2022-09-23';
    this.dateOfBirth = '1990-03-15';
  }

  onSubmit(e) {
    e.preventDefault();
    
    if (!this.firstName || !this.lastName || !this.email || !this.phone || !this.department || !this.position) {
      alert(msg('Please fill all required fields'));
      return;
    }
    
    const employeeData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      department: this.department,
      position: this.position,
      dateOfEmployment: this.dateOfEmployment,
      dateOfBirth: this.dateOfBirth
    };
    
    console.log('Employee data:', employeeData);
    
    alert(this.isEdit ? msg('Employee updated successfully') : msg('Employee created successfully'));
    AppRouter.navigate('/');
  }

  render() {
    return html`
      <page-title .title=${msg('Add Employee')}></page-title>
      
      <div class="card">
        <form @submit=${this.onSubmit}>
        <div class="form-grid">
          <div class="form-field">
            <label class="form-label">${msg('First Name')} *</label>
            <input
              type="text"
              class="form-input"
              .value=${this.firstName}
              @input=${(e) => (this.firstName = e.target.value)}
              required
              placeholder="${msg('Enter first name')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Last Name')} *</label>
            <input
              type="text"
              class="form-input"
              .value=${this.lastName}
              @input=${(e) => (this.lastName = e.target.value)}
              required
              placeholder="${msg('Enter last name')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Email')} *</label>
            <input
              type="email"
              class="form-input"
              .value=${this.email}
              @input=${(e) => (this.email = e.target.value)}
              required
              placeholder="${msg('Enter email address')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Phone')} *</label>
            <input
              type="tel"
              class="form-input"
              .value=${this.phone}
              @input=${(e) => (this.phone = e.target.value)}
              required
              placeholder="${msg('Enter phone number')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Department')} *</label>
            <input
              type="text"
              class="form-input"
              .value=${this.department}
              @input=${(e) => (this.department = e.target.value)}
              required
              placeholder="${msg('Enter department')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Position')} *</label>
            <input
              type="text"
              class="form-input"
              .value=${this.position}
              @input=${(e) => (this.position = e.target.value)}
              required
              placeholder="${msg('Enter position')}"
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Date of Employment')} *</label>
            <input
              type="date"
              class="form-input"
              .value=${this.dateOfEmployment}
              @input=${(e) => (this.dateOfEmployment = e.target.value)}
              required
            />
          </div>
          
          <div class="form-field">
            <label class="form-label">${msg('Date of Birth')}</label>
            <input
              type="date"
              class="form-input"
              .value=${this.dateOfBirth}
              @input=${(e) => (this.dateOfBirth = e.target.value)}
            />
          </div>
        </div>
        
        <div class="actions">
          <button type="button" class="btn btn-secondary" @click=${() => AppRouter.navigate('/')}>${msg('Cancel')}</button>
          <button type="submit" class="btn btn-primary">
            ${msg('Create Employee')}
          </button>
        </div>
      </form>
      </div>
    `;
  }
}

customElements.define('item-form', ItemForm);
