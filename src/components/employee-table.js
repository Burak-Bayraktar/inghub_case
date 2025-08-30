import { LitElement, html, css } from 'lit';

export class EmployeeTable extends LitElement {
  static properties = {
    rows: { type: Array },
    selectedIds: { type: Array, state: true },
  };

  constructor() {
    super();
    this.rows = [
      { id:'1', firstName:'Ahmet', lastName:'Sourtimes', doe:'23/09/2022', dob:'23/09/2022', phone:'+(90) 532 123 45 67', email:'ahmet@sourtimes.org', dept:'Analytics', position:'Junior' },
      { id:'2', firstName:'Ahmet', lastName:'Sourtimes', doe:'23/09/2022', dob:'23/09/2022', phone:'+(90) 532 123 45 67', email:'ahmet@sourtimes.org', dept:'Analytics', position:'Junior' },
    ];
    this.selectedIds = [];
  }

  static styles = css`
    :host { display:block; }
    .card {
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 8px 30px rgba(0,0,0,.06);
      overflow: hidden;
    }
    table { width:100%; border-collapse: separate; border-spacing: 0; }
    thead th {
      text-align: left;
      font-weight: 600;
      color: #ff6a00; /* turuncu başlık */
      padding: 14px 16px;
      font-size: 14px;
      background: #fff;
      position: sticky; top: 0; z-index: 1; /* uzun listede yapışkan header opsiyonel */
    }
    tbody td {
      padding: 18px 16px;
      font-size: 14px;
      color: #2b2b2b;
      border-top: 1px solid #f0f0f0;
      background: #fff;
    }
    tbody tr:hover td { background: #fffaf6; } /* hafif turuncu hover */
    .checkbox {
      width: 44px; text-align: center;
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
      width: 18px; height: 18px;
      fill: #ff6a00;
    }
    /* responsive – küçük ekranlarda bazı kolonları gizle */
    @media (max-width: 900px) {
      .dob, .doe, .dept, .position { display: none; }
    }
    @media (max-width: 640px) {
      .phone { display:none; }
      thead th, tbody td { padding-left: 12px; padding-right:12px; }
    }
  `;

  _toggleAll(e) {
    const checked = e.target.checked;
    this.selectedIds = checked ? this.rows.map(r => r.id) : [];
    this._emitSelection();
  }
  _toggleOne(id, checked) {
    if (checked) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds = [...this.selectedIds, id];
      }
    } else {
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }
    this._emitSelection();
  }
  _isAllChecked() {
    return this.rows.length > 0 && this.selectedIds.length === this.rows.length;
  }
  _emitSelection() {
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { ids: this.selectedIds }, bubbles: true, composed: true
    }));
  }

  _onEdit(row) {
    this.dispatchEvent(new CustomEvent('edit', { detail: row, bubbles:true, composed:true }));
  }
  _onDelete(row) {
    this.dispatchEvent(new CustomEvent('delete', { detail: row, bubbles:true, composed:true }));
  }

  render() {
    return html`
      <div class="card">
        <table>
          <thead>
            <tr>
              <th class="checkbox">
                <input type="checkbox" .checked=${this._isAllChecked()} @change=${this._toggleAll}>
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th class="doe">Date of Employment</th>
              <th class="dob">Date of Birth</th>
              <th class="phone">Phone</th>
              <th>Email</th>
              <th class="dept">Department</th>
              <th class="position">Position</th>
              <th class="actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${this.rows.map(row => html`
              <tr>
                <td class="checkbox">
                  <input
                    type="checkbox"
                    .checked=${this.selectedIds.includes(row.id)}
                    @change=${(e) => this._toggleOne(row.id, e.target.checked)}
                  >
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
                  <button class="icon-btn" @click=${() => this._onEdit(row)} title="Edit">
                    ${this._svgEdit()}
                  </button>
                  <button class="icon-btn" @click=${() => this._onDelete(row)} title="Delete">
                    ${this._svgTrash()}
                  </button>
                </td>
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  _svgEdit() {
    return html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm17.71-10.04a1.001 1.001 0 0 0 0-1.42l-2.5-2.5a1.001 1.001 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.99-1.66z"/>
    </svg>`;
  }
  _svgTrash() {
    return html`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7h12v2H6V7zm2 3h8l-1 11H9L8 10zm3-5h2l1 1h4v2H6V6h4l1-1z"/>
    </svg>`;
  }
}

customElements.define('employee-table', EmployeeTable);
