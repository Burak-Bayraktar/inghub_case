import { html, css } from 'lit';
import { LocalizedComponent } from './localized-component.js';
import { msg } from '@lit/localize';
import { editIcon, trashIcon } from '../assets/icons/index.js';

export class EmployeeListView extends LocalizedComponent {
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
    }
    
    .table-view {
      display: block;
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
  `;

  _toggleAll(e) {
    const checked = e.target.checked;
    const event = new CustomEvent('select-all-toggle', {
      detail: { checked },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _toggleOne(employee) {
    const event = new CustomEvent('employee-toggle', {
      detail: { employee },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  _isAllChecked() {
    return this.employeeList.length > 0 && this.selectedEmployeeList.length === this.employeeList.length;
  }

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
      <div class="table-view">
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
              <th>${msg('Name')}</th>
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
            ${this.employeeList.map(
              (employee) => html`
                <tr>
                  <td class="checkbox">
                    <input
                      type="checkbox"
                      .checked=${this.selectedEmployeeList.includes(employee.id)}
                      @change=${() =>
                        this._toggleOne(employee)}
                    />
                  </td>
                  <td>${employee.name}</td>
                  <td class="doe">${employee.dateOfEmployment}</td>
                  <td class="dob">${employee.dateOfBirth}</td>
                  <td class="phone">${employee.phone}</td>
                  <td><a href="mailto:${employee.email}">${employee.email}</a></td>
                  <td class="dept">${employee.department}</td>
                  <td class="position">${employee.position}</td>
                  <td class="actions">
                    <button
                      class="icon-btn"
                      @click=${() => this._onEdit(employee)}
                      title="Edit"
                    >
                      ${editIcon}
                    </button>
                    <button
                      class="icon-btn"
                      @click=${() => this._onDelete(employee)}
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
      </div>
    `;
  }
}

customElements.define('employee-list-view', EmployeeListView);
