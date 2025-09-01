import {html, css} from 'lit';
import {msg} from '@lit/localize';
import {LocalizedComponent} from './localized-component.js';

export class ConfirmationModal extends LocalizedComponent {
  static styles = css`
    :host {
      display: none;
    }

    :host([open]) {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 90%;
      max-height: 90vh;
      overflow: hidden;
      animation: modalAppear 0.2s ease-out;
    }

    @keyframes modalAppear {
      from {
        opacity: 0;
        transform: scale(0.9) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .modal-header {
      padding: 20px 24px 16px 24px;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 18px;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: all 0.2s;
    }

    .close-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .modal-body {
      padding: 20px 24px;
    }

    .modal-message {
      font-size: 14px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0;
    }

    .modal-footer {
      padding: 16px 24px 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      min-width: 80px;
    }

    .btn-secondary {
      background: #f9fafb;
      color: #374151;
      border: 1px solid #d1d5db;
    }

    .btn-secondary:hover {
      background: #f3f4f6;
    }

    .btn-danger {
      background: #ff6200;
      color: white;
    }

    .btn-danger:hover {
      background: #e55100;
    }
  `;

  static properties = {
    title: {type: String},
    message: {type: String},
    confirmText: {type: String},
    cancelText: {type: String},
    open: {type: Boolean, reflect: true}
  };

  constructor() {
    super();
    this.title = '';
    this.message = '';
    this.confirmText = msg('Proceed');
    this.cancelText = msg('Cancel');
    this.open = false;
  }

  _onConfirm() {
    this.dispatchEvent(new CustomEvent('confirm', {
      bubbles: true,
      composed: true
    }));
  }

  _onCancel() {
    this.dispatchEvent(new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    }));
  }

  _onBackdropClick(e) {
    if (e.target === e.currentTarget) {
      this._onCancel();
    }
  }

  render() {
    return html`
      <div @click=${this._onBackdropClick}>
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">${this.title}</h3>
            <button type="button" class="close-btn" @click=${this._onCancel}>×</button>
          </div>
          
          <div class="modal-body">
            <p class="modal-message">${this.message}</p>
          </div>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click=${this._onCancel}>
              ${this.cancelText}
            </button>
            <button type="button" class="btn btn-danger" @click=${this._onConfirm}>
              ${this.confirmText}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirmation-modal', ConfirmationModal);
