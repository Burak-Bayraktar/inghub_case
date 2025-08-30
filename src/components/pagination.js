import {html, css, LitElement} from 'lit';

export class AppPagination extends LitElement {
  static properties = {
    page: {type: Number, reflect: true},
    pageSize: {type: Number},
    total: {type: Number},
    siblingCount: {type: Number},
    disabled: {type: Boolean, reflect: true},
    _pages: {state: true},
  };

  static styles = css`
    :host {
      display: block;
    }
    nav {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn,
    .num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 32px;
      height: 32px;
      padding: 0 8px;
      border-radius: 999px;
      cursor: pointer;
      user-select: none;
      color: #444;
      background: transparent;
      border: none;
      font: inherit;
    }
    .btn[disabled],
    :host([disabled]) .btn,
    :host([disabled]) .num {
      opacity: 0.4;
      pointer-events: none;
    }
    .num.active {
      background: #ff6a00;
      color: #fff;
      font-weight: 700;
    }
    .ellipsis {
      color: #999;
      padding: 0 4px;
    }
    .btn:hover,
    .num:hover {
      background: #f4f4f4;
    }
    .icon {
      width: 18px;
      height: 18px;
    }
  `;

  constructor() {
    super();
    this.page = 1;
    this.pageSize = 10;
    this.total = 0;
    this.siblingCount = 1;
  }

  willUpdate(changed) {
    if (
      changed.has('page') ||
      changed.has('pageSize') ||
      changed.has('total') ||
      changed.has('siblingCount')
    ) {
      this._pages = this._buildRange();
    }
  }

  get pageCount() {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  _buildRange() {
    const totalPageCount = this.pageCount;
    const totalNumbers = this.siblingCount * 2 + 5;

    if (totalPageCount <= totalNumbers) {
      return Array.from({length: totalPageCount}, (_, i) => i + 1);
    }

    const leftSibling = Math.max(this.page - this.siblingCount, 1);
    const rightSibling = Math.min(
      this.page + this.siblingCount,
      totalPageCount
    );

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPageCount - 1;

    const range = [];

    range.push(1);

    if (showLeftDots) range.push('…');

    const start = showLeftDots ? leftSibling : 2;
    const end = showRightDots ? rightSibling : totalPageCount - 1;
    for (let i = start; i <= end; i++) range.push(i);

    if (showRightDots) range.push('…');

    range.push(totalPageCount);

    return range;
  }

  _go(p) {
    const n = typeof p === 'number' ? p : this.page + (p === 'next' ? 1 : -1);
    const target = Math.min(this.pageCount, Math.max(1, n));
    if (target === this.page) return;
    this.page = target;
    this.dispatchEvent(
      new CustomEvent('page-change', {
        detail: {page: this.page, pageSize: this.pageSize},
        bubbles: true,
        composed: true,
      })
    );
  }

  _onKey(e) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this._go('prev');
    }
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this._go('next');
    }
  }

  render() {
    const pc = this.pageCount;
    return html`
      <nav
        role="navigation"
        aria-label="Pagination"
        tabindex="0"
        @keydown=${this._onKey}
      >
        <button
          class="btn"
          ?disabled=${this.page <= 1 || this.disabled}
          @click=${() => this._go('prev')}
          aria-label="Previous"
        >
          ${this._chevronLeft()}
        </button>

        ${this._pages?.map((p) =>
          p === '…'
            ? html`<span class="ellipsis" aria-hidden="true">…</span>`
            : html`<button
                class="num ${p === this.page ? 'active' : ''}"
                @click=${() => this._go(p)}
                aria-current=${p === this.page ? 'page' : 'false'}
              >
                ${p}
              </button>`
        )}

        <button
          class="btn"
          ?disabled=${this.page >= pc || this.disabled}
          @click=${() => this._go('next')}
          aria-label="Next"
        >
          ${this._chevronRight()}
        </button>
      </nav>
    `;
  }

  _chevronLeft() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg> `;
  }
  _chevronRight() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg> `;
  }
}
customElements.define('app-pagination', AppPagination);
