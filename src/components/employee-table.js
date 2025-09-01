import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';
import {EmployeeService} from '../services/employee-service.js';
import {listIcon, gridIcon} from '../assets/icons/index.js';
import './pagination.js';
import './employee-table-view.js';
import './employee-list-view.js';
import './page-title.js';
import './confirmation-modal.js';

export class EmployeeTable extends LocalizedComponent {
  static properties = {
    rows: {type: Array},
    selectedIds: {type: Array, state: true},
    currentPage: {type: Number, state: true},
    pageSize: {type: Number},
    totalRows: {type: Number, state: true},
    viewMode: {type: String, state: true},
    showDeleteModal: {type: Boolean, state: true},
    employeeToDelete: {type: Object, state: true},
    searchTerm: {type: String, state: true},
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 9;
    this.selectedIds = [];
    this.viewMode = EmployeeService.getViewMode();
    this.totalRows = 0;
    this.showDeleteModal = false;
    this.employeeToDelete = null;
    this.searchTerm = '';
    this._storeUnsubscribe = null;

    this._loadEmployeeData();
  }

  connectedCallback() {
    super.connectedCallback();
    this._storeUnsubscribe = EmployeeService.subscribe(() => {
      this._loadEmployeeData();
      this.viewMode = EmployeeService.getViewMode();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._storeUnsubscribe) {
      this._storeUnsubscribe();
    }
  }

  _loadEmployeeData() {
    let allEmployees;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      allEmployees = EmployeeService.searchEmployees(this.searchTerm);
    } else {
      allEmployees = EmployeeService.getAllEmployees();
    }
    
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    
    this.rows = allEmployees.slice(startIndex, endIndex);
    this.totalRows = allEmployees.length;
    this.requestUpdate();
  }

  _setViewMode(mode) {
    EmployeeService.setViewMode(mode);
  }

  _onSearchInput(e) {
    this.searchTerm = e.target.value;
    this.currentPage = 1;
    this._loadEmployeeData();
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }
    
    .card {
      background: rgb(248, 249, 250);
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
    
    .search-container {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
      max-width: 400px;
    }
    
    .search-input {
      flex: 1;
      padding: 8px 12px;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      font-size: 14px;
      background: white;
      transition: border-color 0.2s;
    }
    
    .search-input:focus {
      outline: none;
      border-color: #ff6200;
      box-shadow: 0 0 0 2px rgba(255, 98, 0, 0.1);
    }
    
    .search-input::placeholder {
      color: #6c757d;
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

    .empty-state {
      padding: 60px 20px;
      text-align: center;
      background: white;
    }

    .empty-state-content h3 {
      color: #495057;
      font-size: 1.5rem;
      margin: 0 0 12px 0;
      font-weight: 600;
    }

    .empty-state-content p {
      color: #6c757d;
      font-size: 1rem;
      margin: 0 0 24px 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    .add-employee-btn {
      display: inline-block;
      background: #ff6200;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .add-employee-btn:hover {
      background: #e55a00;
    }

    @media (max-width: 768px) {
      .table-header {
        padding: 12px 16px;
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
    
    if (originalRow) {
      this.employeeToDelete = originalRow;
      this.showDeleteModal = true;
    }
  }

  _onDeleteConfirm() {
    if (this.employeeToDelete) {
      EmployeeService.deleteEmployee(this.employeeToDelete.id);
      this.selectedIds = this.selectedIds.filter(id => id !== this.employeeToDelete.id);
    }
    this._closeDeleteModal();
  }

  _onDeleteCancel() {
    this._closeDeleteModal();
  }

  _closeDeleteModal() {
    this.showDeleteModal = false;
    this.employeeToDelete = null;
  }

  _onPageChange(e) {
    this.currentPage = e.detail.page;
    this._loadEmployeeData();
    this.selectedIds = [];
  }

  render() {
    const formattedEmployees = this._formatEmployeeData();
    
    return html`
      <div class="card">
        <div class="table-header">
          <page-title .title=${msg('Employee List')} inline></page-title>
          <div class="search-container">
            <input 
              type="text" 
              class="search-input"
              placeholder="${msg('Search employees...')}"
              .value=${this.searchTerm}
              @input=${this._onSearchInput}
            />
          </div>
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
        
        ${this.totalRows === 0 
          ? html`
            <div class="empty-state">
              <div class="empty-state-content">
                <h3>${msg('No employees found')}</h3>
                <p>${msg('Start by adding your first employee to the system.')}</p>
                <a href="#/new" class="add-employee-btn">
                  ${msg('Add Employee')}
                </a>
              </div>
            </div>
          `
          : this.viewMode === 'list' 
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
        
        ${this.totalRows > 0 ? html`
          <div class="pagination-container">
            <app-pagination
              .page=${this.currentPage}
              .pageSize=${this.pageSize}
              .total=${this.totalRows}
              @page-change=${this._onPageChange}
            ></app-pagination>
          </div>
        ` : ''}
      </div>
      
      <confirmation-modal
        .open=${this.showDeleteModal}
        .title=${msg('Are you sure?')}
        .message=${this.employeeToDelete 
          ? `${msg('Selected Employee record of')} ${this.employeeToDelete.firstName} ${this.employeeToDelete.lastName} ${msg('will be deleted')}`
          : ''}
        .confirmText=${msg('Proceed')}
        .cancelText=${msg('Cancel')}
        @confirm=${this._onDeleteConfirm}
        @cancel=${this._onDeleteCancel}
      ></confirmation-modal>
    `;
  }
}

customElements.define('employee-table', EmployeeTable);
