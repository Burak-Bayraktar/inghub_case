import { html, css } from 'lit';
import { Router } from '@vaadin/router';
import { msg } from '@lit/localize';
import { LocalizedComponent } from './localized-component.js';

import './item-list.js';
import './item-form.js';

export class AppRoot extends LocalizedComponent {
  static styles = css`
    :host { display:block; }
    header { padding:16px 0; display:flex; gap:12px; align-items:center; justify-content:space-between; }
    header .header-left { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    nav a { margin-right: 10px; }
    .header-right { display: flex; gap: 32px; align-items: center; }
    .header-right button { 
      padding: 4px 8px; 
      border: 1px solid #ccc; 
      background: white; 
      cursor: pointer; 
      border-radius: 4px;
    }
    .language-switcher button.active { 
      background: #ff6a00; 
      color: white; 
      border-color: #ff6a00;
    }
    .container { margin: 0; padding: 0; }
  `;

  render() {
    return html`
      <div class="container">
        <header>
          <div class="header-left">
            <h2 style="margin:0">${msg('Employee List')}</h2>
            <nav>
            </nav>
          </div>
          <div class="header-right">
            <a href="#/new">${msg('New')}</a>
            <div class="language-switcher">
              <button 
                class="${this._currentLocale === 'en' ? 'active' : ''}"
                @click="${() => this._setLocale('en')}">
                EN
              </button>
              <button 
                class="${this._currentLocale === 'tr' ? 'active' : ''}"
                @click="${() => this._setLocale('tr')}">
                TR
              </button>
            </div>
          </div>
        </header>
        <div id="outlet"></div>
      </div>
    `;
  }

  firstUpdated() {
    const outlet = this.renderRoot.querySelector('#outlet');
    const router = new Router(outlet, { useHash: true });

    router.setRoutes([
      { path: '/', component: 'item-list' },
      { path: '/new',  component: 'item-form' },
      { path: '/edit/:id', component: 'item-form' },
      { path: '(.*)', action: (ctx, commands) => commands.redirect('/') },
    ]);
  }

  _setLocale(locale) {
    if (window.appSetLocale) {
      window.appSetLocale(locale).then(() => {
        // URL'i güncelle
        const url = new URL(window.location);
        url.searchParams.set('locale', locale);
        window.history.replaceState({}, '', url);
        
        // Global locale change event fırlat
        window.dispatchEvent(new CustomEvent('locale-changed', { 
          detail: { locale } 
        }));
        
        // App root'u yeniden render et
        this.requestUpdate();
      });
    }
  }
}

customElements.define('app-root', AppRoot);
