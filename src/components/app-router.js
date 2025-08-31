import { html, css, LitElement } from 'lit';

export class AppRouter extends LitElement {
  static properties = {
    currentRoute: { type: String, state: true },
    routeParams: { type: Object, state: true }
  };

  static styles = css`
    :host {
      display: block;
    }
  `;

  constructor() {
    super();
    this.currentRoute = '/';
    this.routeParams = {};
  }

  connectedCallback() {
    super.connectedCallback();
    
    this._handleRouteChange();
    
    window.addEventListener('hashchange', this._handleRouteChange.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._handleRouteChange.bind(this));
  }

  _handleRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    console.log('Router: Route changed to:', hash);
    
    let route, params = {};
    
    if (hash === '/') {
      route = '/';
    } else if (hash === '/new') {
      route = '/new';
    } else if (hash.startsWith('/edit/')) {
      route = '/edit';
      const id = hash.split('/')[2];
      params = { id };
    } else {
      route = '/';
      window.location.hash = '/';
    }

    this.currentRoute = route;
    this.routeParams = params;
    
    this.dispatchEvent(
      new CustomEvent('route-changed', {
        detail: { route, params },
        bubbles: true,
        composed: true
      })
    );
  }

  navigate(route, params = {}) {
    let hash = route;
    
    if (route === '/edit' && params.id) {
      hash = `/edit/${params.id}`;
    }
    
    window.location.hash = hash;
  }

  static navigate(route, params = {}) {
    let hash = route;
    
    if (route === '/edit' && params.id) {
      hash = `/edit/${params.id}`;
    }
    
    window.location.hash = hash;
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('app-router', AppRouter);
