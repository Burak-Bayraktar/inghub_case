import { html, css } from 'lit';
import { LocalizedComponent } from './localized-component.js';
import { msg } from '@lit/localize';
import { editIcon, trashIcon } from '../assets/icons/index.js';

export class EmployeeTableView extends LocalizedComponent {
  static properties = {
    employees: { type: String },
    selectedEmployees: { type: String }
  };

  constructor() {
    super();
    this.employees = '[]';
    this.selectedEmployees = '[]';
  }

  get employeeList() {
    try {
      if (!this.employees || this.employees === 'null' || this.employees === 'undefined') {
        return [];
      }
      return JSON.parse(this.employees);
    } catch {
      return [];
    }
  }

  get selectedEmployeeList() {
    try {
      return JSON.parse(this.selectedEmployees);
    } catch {
      return [];
    }
  }

  static styles = css`
    :host {
      display: block;
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .grid-view {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 40px 120px;
      width: 100%;
      place-items: center;
    }
    
    .employee-card {
      background: #fff;
      border-radius: 16px;
      padding: 32px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      position: relative;
      width: 100%;
      max-width: 450px;
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .card-header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .card-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }
    
    .card-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .card-label {
      font-weight: 500;
      color: #9ca3af;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .card-value {
      color: #374151;
      font-size: 15px;
      line-height: 1.4;
      font-weight: 500;
    }
    
    .card-value a {
      color: #ff6200;
      text-decoration: none;
    }
    
    .card-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-start;
      margin-top: auto;
    }
    
    .action-btn {
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      min-width: 80px;
      justify-content: center;
    }
    
    .edit-btn {
      background: #6366f1;
      color: white;
    }
    
    .delete-btn {
      background: #ef4444;
      color: white;
    }
    
    .action-btn svg {
      width: 16px;
      height: 16px;
      fill: currentColor;
    }

    @media (max-width: 1200px) {
      :host {
        padding: 16px;
      }
      
      .grid-view {
        gap: 128px;
      }
      
      .employee-card {
        padding: 28px;
      }
    }

    @media (max-width: 768px) {
      .grid-view {
        grid-template-columns: 1fr;
        gap: 32px;
        max-width: 450px;
        margin: 0 auto;
      }
      
      .employee-card {
        max-width: 100%;
      }
      
      .card-content {
        grid-template-columns: 1fr;
        gap: 16px;
      }
      
      .card-title {
        font-size: 20px;
      }
      
      .card-subtitle {
        font-size: 14px;
      }
    }

    @media (max-width: 480px) {
      :host {
        padding: 16px;
      }
      
      .grid-view {
        gap: 24px;
      }
      
      .employee-card {
        padding: 24px;
      }
      
      .card-title {
        font-size: 18px;
      }
      
      .card-actions {
        gap: 8px;
      }
      
      .action-btn {
        padding: 8px 16px;
        font-size: 13px;
        min-width: 70px;
      }
    }
  `;

  _onEdit(employee) {
    this.dispatchEvent(
      new CustomEvent('employee-edit', {
        detail: { employee },
        bubbles: true,
        composed: true
      })
    );
  }

  _onDelete(employee) {
    this.dispatchEvent(
      new CustomEvent('employee-delete', {
        detail: { employee },
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <div class="grid-view">
        ${(this.employeeList || []).map(
          (employee) => html`
            <div class="employee-card">
              <div class="card-header">
                <div class="card-field">
                  <span class="card-label">${msg('First Name')}</span>
                  <span class="card-value">${(employee.name || '').split(' ')[0] || ''}</span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Last Name')}</span>
                  <span class="card-value">${(employee.name || '').split(' ').slice(1).join(' ')}</span>
                </div>
              </div>
              
              <div class="card-content">
                <div class="card-field">
                  <span class="card-label">${msg('Date of Employment')}</span>
                  <span class="card-value">${employee.dateOfEmployment || ''}</span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Date of Birth')}</span>
                  <span class="card-value">${employee.dateOfBirth || ''}</span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Phone')}</span>
                  <span class="card-value">${employee.phone || ''}</span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Email')}</span>
                  <span class="card-value">
                    <a href="mailto:${employee.email || ''}">${employee.email || ''}</a>
                  </span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Department')}</span>
                  <span class="card-value">${employee.department || ''}</span>
                </div>
                <div class="card-field">
                  <span class="card-label">${msg('Position')}</span>
                  <span class="card-value">${employee.position || ''}</span>
                </div>
              </div>
              
              <div class="card-actions">
                <button
                  class="action-btn edit-btn"
                  @click=${() => this._onEdit(employee)}
                  title="${msg('Edit')}"
                >
                  ${editIcon}
                  ${msg('Edit')}
                </button>
                <button
                  class="action-btn delete-btn"
                  @click=${() => this._onDelete(employee)}
                  title="${msg('Delete')}"
                >
                  ${trashIcon}
                  ${msg('Delete')}
                </button>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}

customElements.define('employee-table-view', EmployeeTableView);
