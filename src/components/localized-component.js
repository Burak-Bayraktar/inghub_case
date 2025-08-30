import { LitElement } from 'lit';
import { localized } from '@lit/localize';

export class LocalizedComponent extends LitElement {
  static properties = {
    currentLocale: { type: String, state: true },
  };

  constructor() {
    super();
    this.currentLocale = window.appGetLocale ? window.appGetLocale() : 'en';
  }

  connectedCallback() {
    super.connectedCallback();
    // Locale değişikliğini dinle
    this._onLocaleChange = () => {
      this.currentLocale = window.appGetLocale ? window.appGetLocale() : 'en';
    };
    window.addEventListener('locale-changed', this._onLocaleChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('locale-changed', this._onLocaleChange);
  }
}

// Localized decorator'ını uygula
localized(LocalizedComponent);
