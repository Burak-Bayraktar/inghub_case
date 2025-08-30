import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';
import {EmployeeService} from '../services/employee-service.js';
import {editIcon, trashIcon} from '../assets/icons/index.js';
import './pagination.js';

export class EmployeeTable extends LocalizedComponent {
  static properties = {
    rows: {type: Array},
    selectedIds: {type: Array, state: true},
    currentPage: {type: Number, state: true},
    pageSize: {type: Number},
    totalRows: {type: Number, state: true},
  };

  constructor() {
    super();
    this.currentPage = 1;
    this.pageSize = 9;
    this.selectedIds = [];

    const employeeData = EmployeeService.getEmployeesPaginated(
      this.currentPage,
      this.pageSize
    );
    this.rows = employeeData.data;
    this.totalRows = employeeData.total;
  }

  static styles = css`
    :host {
      display: block;
    }
    .card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
      overflow: hidden;
    }
    table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }
    thead th {
      text-align: left;
      font-weight: 600;
      color: #ff6a00;
      padding: 14px 16px;
      font-size: 14px;
      background: #fff;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    tbody td {
      padding: 18px 16px;
      font-size: 14px;
      color: #2b2b2b;
      border-top: 1px solid #f0f0f0;
      background: #fff;
    }
    tbody tr:hover td {
      background: #fffaf6;
    }
    .checkbox {
      width: 44px;
      text-align: center;
    }
    .actions {
      width: 90px;
      text-align: right;
      white-space: nowrap;
    }
    .icon-btn {
      border: 0;
      background: transparent;
      padding: 6px;
      cursor: pointer;
      vertical-align: middle;
    }
    .icon {
      width: 18px;
      height: 18px;
      fill: #ff6a00;
    }

    @media (max-width: 900px) {
      .dob,
      .doe,
      .dept,
      .position {
        display: none;
      }
    }
    @media (max-width: 640px) {
      .phone {
        display: none;
      }
      thead th,
      tbody td {
        padding-left: 12px;
        padding-right: 12px;
      }
    }

    .pagination-container {
      padding: 16px 20px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      justify-content: center;
      background: #fff;
    }
  `;

  _toggleAll(e) {
    const checked = e.target.checked;
    this.selectedIds = checked ? this.rows.map((r) => r.id) : [];
    this._emitSelection();
  }
  _toggleOne(id, checked) {
    if (checked) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds = [...this.selectedIds, id];
      }
    } else {
      this.selectedIds = this.selectedIds.filter(
        (selectedId) => selectedId !== id
      );
    }
    this._emitSelection();
  }
  _isAllChecked() {
    return this.rows.length > 0 && this.selectedIds.length === this.rows.length;
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

  _onEdit(row) {
    this.dispatchEvent(
      new CustomEvent('edit', {detail: row, bubbles: true, composed: true})
    );
  }
  _onDelete(row) {
    this.dispatchEvent(
      new CustomEvent('delete', {detail: row, bubbles: true, composed: true})
    );
  }

  _getPaginatedRows() {
    const employeeData = EmployeeService.getEmployeesPaginated(
      this.currentPage,
      this.pageSize
    );
    return employeeData.data;
  }

  _onPageChange(e) {
    this.currentPage = e.detail.page;
    this.rows = this._getPaginatedRows();
    this.selectedIds = [];
  }

  render() {
    return html`
      <div class="card">
        <table>
          <thead>
            <tr>
              <th class="checkbox">
                <input
                  type="checkbox"
                  .checked=${this._isAllChecked()}
                  @change=${this._toggleAll}
                />
              </th>
              <th>${msg('First Name')}</th>
              <th>${msg('Last Name')}</th>
              <th class="doe">${msg('Date of Employment')}</th>
              <th class="dob">${msg('Date of Birth')}</th>
              <th class="phone">${msg('Phone')}</th>
              <th>${msg('Email')}</th>
              <th class="dept">${msg('Department')}</th>
              <th class="position">${msg('Position')}</th>
              <th class="actions">${msg('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(
              (row) => html`
                <tr>
                  <td class="checkbox">
                    <input
                      type="checkbox"
                      .checked=${this.selectedIds.includes(row.id)}
                      @change=${(e) =>
                        this._toggleOne(row.id, e.target.checked)}
                    />
                  </td>
                  <td>${row.firstName}</td>
                  <td>${row.lastName}</td>
                  <td class="doe">${row.doe}</td>
                  <td class="dob">${row.dob}</td>
                  <td class="phone">${row.phone}</td>
                  <td><a href="mailto:${row.email}">${row.email}</a></td>
                  <td class="dept">${row.dept}</td>
                  <td class="position">${row.position}</td>
                  <td class="actions">
                    <button
                      class="icon-btn"
                      @click=${() => this._onEdit(row)}
                      title="Edit"
                    >
                      ${editIcon}
                    </button>
                    <button
                      class="icon-btn"
                      @click=${() => this._onDelete(row)}
                      title="Delete"
                    >
                      ${trashIcon}
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>

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
