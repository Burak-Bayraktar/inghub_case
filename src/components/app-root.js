import { html, css } from 'lit';
import { msg } from '@lit/localize';
import { LocalizedComponent } from './localized-component.js';
import { ukFlag, turkeyFlag } from '../assets/flags/index.js';

import './app-router.js';
import './item-list.js';
import './item-form.js';

export class AppRoot extends LocalizedComponent {
  static properties = {
    currentRoute: { type: String, state: true },
    routeParams: { type: Object, state: true }
  };

  constructor() {
    super();
    this.currentRoute = '/';
    this.routeParams = {};
  }
  static styles = css`
    :host { display:block; }
    .header-top {
      height: 48px;
      background: #FFFFFF;
      border-bottom: 1px solid #e55100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
    
    .header-top-left {
      display: flex;
      align-items: center;
    }
    .header-top-logo {
      font-size: 24px;
      font-weight: bold;
      color: #ff6200;
      text-decoration: none;
      letter-spacing: -0.5px;
    }
    .header-top-right {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    .header-top-nav {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .header-top-nav a {
      text-decoration: none;
      color: #ff6200;
      font-weight: 500;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .header-top-nav a:hover {
      background-color: #ff6200;
      color: white;
    }
    .header-top-nav a.active {
      background-color: #ff6200;
      color: white;
    }
    .header-top .language-switcher {
      display: flex;
      gap: 8px;
    }
    .header-top .language-switcher button {
      padding: 4px;
      border: 2px solid transparent;
      background: transparent;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-top .language-switcher button:hover {
      border-color: #ff6200;
      transform: scale(1.05);
    }
    .header-top .language-switcher svg {
      width: 24px;
      height: 24px;
      border-radius: 2px;
    }
    .container { margin: 0; padding: 0; }
    
    @media (max-width: 768px) {
      .header-top {
        padding: 0 16px;
        height: 56px;
      }
      .header-top-logo {
        font-size: 20px;
      }
      .header-top-right {
        gap: 16px;
      }
      .header-top-nav {
        gap: 12px;
      }
      .header-top-nav a {
        font-size: 12px;
        padding: 4px 8px;
      }
      .header-top .language-switcher button {
        padding: 3px;
      }
      .header-top .language-switcher svg {
        width: 20px;
        height: 20px;
      }
    }
    
    @media (max-width: 480px) {
      .header-top {
        padding: 0 12px;
      }
      .header-top-nav a {
        font-size: 11px;
        padding: 3px 6px;
      }
      .header-top-right {
        gap: 12px;
      }
      .header-top-nav {
        gap: 8px;
      }
      .header-top .language-switcher svg {
        width: 18px;
        height: 18px;
      }
    }
  `;

  firstUpdated() {
    super.firstUpdated();
  }

  _onRouteChanged(event) {
    this.currentRoute = event.detail.route;
    this.routeParams = event.detail.params;
  }

  _setLocale(locale) {
    if (window.appSetLocale) {
      window.appSetLocale(locale).then(() => {
        const url = new URL(window.location);
        url.searchParams.set('locale', locale);
        window.history.replaceState({}, '', url);
        
        window.dispatchEvent(new CustomEvent('locale-changed', { 
          detail: { locale } 
        }));
        
        this.requestUpdate();
      });
    }
  }

  _getCurrentLocale() {
    return window.appGetLocale ? window.appGetLocale() : 'en';
  }

  _renderCurrentRoute() {
    switch (this.currentRoute) {
      case '/':
        return html`<item-list></item-list>`;
      case '/new':
        return html`<item-form .isEdit=${false}></item-form>`;
      case '/edit':
        return html`<item-form .isEdit=${true} .employeeId=${this.routeParams.id}></item-form>`;
      default:
        return html`<item-list></item-list>`;
    }
  }

  _onEdit(event) {
    const employee = event.detail;
    window.location.hash = `/edit/${employee.id}`;
  }

  render() {
    return html`
      <app-router @route-changed=${this._onRouteChanged}></app-router>
      
      <div class="container">
        <div class="header-top">
          <div class="header-top-left">
            <a href="#/" class="header-top-logo">ING</a>
          </div>
          <div class="header-top-right">
            <div class="header-top-nav">
              <a href="#/" class="${this.currentRoute === '/' ? 'active' : ''}">${msg('Employee List')}</a>
              <a href="#/new" class="${this.currentRoute === '/new' ? 'active' : ''}">${msg('Add New')}</a>
            </div>
            <div class="language-switcher">
              ${this._getCurrentLocale() === 'en' ? html`
                <button 
                  @click="${() => this._setLocale('tr')}"
                  title="Switch to Turkish">
                  ${turkeyFlag}
                </button>
              ` : html`
                <button 
                  @click="${() => this._setLocale('en')}"
                  title="Switch to English">
                  ${ukFlag}
                </button>
              `}
            </div>
          </div>
        </div>
        <div id="outlet" @edit=${this._onEdit}>
          ${this._renderCurrentRoute()}
        </div>
      </div>
    `;
  }
}

customElements.define('app-root', AppRoot);
