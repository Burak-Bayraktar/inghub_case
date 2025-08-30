import { LitElement, html, css } from 'lit';
import { Router } from '@vaadin/router';

import './item-list.js';
import './item-form.js';

export class AppRoot extends LitElement {
  static styles = css`
    :host { display:block; }
    header { padding:16px 0; display:flex; gap:12px; align-items:center; }
    nav a { margin-right: 10px; }
    .container { margin: 28px auto; padding: 0 16px; }
    .card { background: var(--panel, #111827); border-radius: 14px; padding: 16px; }
  `;

  render() {
    return html`
      <div class="container">
        <header>
          <h2 style="margin:0">Employee List</h2>
          <span style="flex:1"></span>
          <nav>
            <a href="#/list">Liste</a>
            <a href="#/new">Yeni</a>
          </nav>
        </header>
        <div class="card">
          <div id="outlet"></div>
        </div>
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
}
customElements.define('app-root', AppRoot);
