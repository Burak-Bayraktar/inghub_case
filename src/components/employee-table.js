import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';
import {EmployeeService} from '../services/employee-service.js';
import {listIcon, gridIcon} from '../assets/icons/index.js';
import './pagination.js';
import './employee-table-view.js';
import './employee-list-view.js';

export class EmployeeTable extends LocalizedComponent {
  static properties = {
    rows: {type: Array},
    selectedIds: {type: Array, state: true},
    currentPage: {type: Number, state: true},
    pageSize: {type: Number},
    totalRows: {type: Number, state: true},
    viewMode: {type: String, state: true},
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 9;
    this.selectedIds = [];
    this.viewMode = 'list';

    const employeeData = EmployeeService.getEmployeesPaginated(
      this.currentPage,
      this.pageSize
    );
    this.rows = employeeData.data;
    this.totalRows = employeeData.total;
  }

  _setViewMode(mode) {
    this.viewMode = mode;
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .table-header {
      padding: 16px 20px;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .table-title {
      font-size: 18px;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
    
    .view-switcher {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .view-switcher button {
      padding: 8px 12px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff6200;
    }
    
    .view-switcher button svg {
      opacity: 0.3;
      transition: opacity 0.2s;
    }
    
    .view-switcher button:hover svg {
      opacity: 0.85;
    }
    
    .view-switcher button.active svg {
      opacity: 1;
    }
    
    .pagination-container {
      padding: 16px;
      border-top: 1px solid #eee;
      background: #f8f9fa;
      display: flex;
      justify-content: center;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .table-header {
        padding: 12px 16px;
      }
      
      .table-title {
        font-size: 16px;
      }
      
      .view-switcher button {
        padding: 6px 10px;
      }
      
      .pagination-container {
        padding: 12px;
      }
    }
    
    @media (max-width: 480px) {
      .view-switcher button {
        padding: 4px 8px;
      }
    }
  `;

  _formatEmployeeData() {
    return this.rows.map(row => ({
      id: row.id,
      name: `${row.firstName} ${row.lastName}`,
      position: row.position,
      department: row.dept,
      email: row.email,
      phone: row.phone,
      dateOfBirth: row.dob,
      dateOfEmployment: row.doe
    }));
  }

  _onEmployeeToggle(event) {
    const employee = event.detail.employee;
    const isSelected = this.selectedIds.includes(employee.id);
    
    if (isSelected) {
      this.selectedIds = this.selectedIds.filter(id => id !== employee.id);
    } else {
      this.selectedIds = [...this.selectedIds, employee.id];
    }
    
    this._emitSelection();
  }

  _onSelectAllToggle(event) {
    const checked = event.detail.checked;
    this.selectedIds = checked ? this.rows.map(row => row.id) : [];
    this._emitSelection();
  }

  _emitSelection() {
    this.dispatchEvent(
      new CustomEvent('selection-change', {
        detail: {ids: this.selectedIds},
        bubbles: true,
        composed: true,
      })
    );
  }

  _onEmployeeEdit(event) {
    const employee = event.detail.employee;
    const originalRow = this.rows.find(row => row.id === employee.id);
    
    this.dispatchEvent(
      new CustomEvent('edit', {
        detail: originalRow,
        bubbles: true,
        composed: true
      })
    );
  }

  _onEmployeeDelete(event) {
    const employee = event.detail.employee;
    const originalRow = this.rows.find(row => row.id === employee.id);
    
    this.dispatchEvent(
      new CustomEvent('delete', {
        detail: originalRow,
        bubbles: true,
        composed: true
      })
    );
  }

  _onPageChange(e) {
    this.currentPage = e.detail.page;
    const employeeData = EmployeeService.getEmployeesPaginated(
      this.currentPage,
      this.pageSize
    );
    this.rows = employeeData.data;
    this.selectedIds = [];
  }

  render() {
    const formattedEmployees = this._formatEmployeeData();
    
    return html`
      <div class="card">
        <div class="table-header">
          <h2 class="table-title">${msg('Employees')}</h2>
          <div class="view-switcher">
            <button 
              class="${this.viewMode === 'list' ? 'active' : ''}"
              @click="${() => this._setViewMode('list')}"
              title="${msg('List View')}">
              ${listIcon}
            </button>
            <button 
              class="${this.viewMode === 'table' ? 'active' : ''}"
              @click="${() => this._setViewMode('table')}"
              title="${msg('Table View')}">
              ${gridIcon}
            </button>
          </div>
        </div>
        
        ${this.viewMode === 'list' 
          ? html`
            <employee-list-view 
              employees=${JSON.stringify(formattedEmployees)}
              selectedEmployees=${JSON.stringify(this.selectedIds)}
              @employee-toggle=${this._onEmployeeToggle}
              @employee-edit=${this._onEmployeeEdit}
              @employee-delete=${this._onEmployeeDelete}
              @select-all-toggle=${this._onSelectAllToggle}
            ></employee-list-view>
          `
          : html`
            <employee-table-view 
              employees=${JSON.stringify(formattedEmployees)}
              selectedEmployees=${JSON.stringify(this.selectedIds)}
              @employee-toggle=${this._onEmployeeToggle}
              @employee-edit=${this._onEmployeeEdit}
              @employee-delete=${this._onEmployeeDelete}
              @select-all-toggle=${this._onSelectAllToggle}
            ></employee-table-view>
          `
        }
        
        <div class="pagination-container">
          <app-pagination
            .page=${this.currentPage}
            .pageSize=${this.pageSize}
            .total=${this.totalRows}
            @page-change=${this._onPageChange}
          ></app-pagination>
        </div>
      </div>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
