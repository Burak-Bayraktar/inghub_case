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
    
    if (!hash.startsWith('/')) {
      hash = '/' + hash;
    }
    
    if (route === '/edit' && params.id) {
      hash = `/edit/${params.id}`;
    }
    
    window.location.hash = hash || '/';
  }

  static getCurrentRoute() {
    const hash = window.location.hash.slice(1) || '/';
    
    let route, params = {}, query = {};
    
    const [pathPart, queryPart] = hash.split('?');
    
    if (queryPart) {
      query = this._parseQuery(queryPart);
    }
    
    if (pathPart === '/' || pathPart === '') {
      route = '/';
    } else if (pathPart === '/new') {
      route = '/new';
    } else if (pathPart.startsWith('/edit/')) {
      route = '/edit';
      const id = pathPart.split('/')[2];
      params = { id };
    } else if (pathPart === '/test') {
      route = '/test';
    } else {
      route = '/';
    }
    
    return { route, params, query };
  }

  static _matchRoute(pattern, path) {
    if (pattern === '/' && path === '/') {
      return true;
    }
    
    const patternParts = pattern.split('/').filter(p => p !== '');
    const pathParts = path.split('/').filter(p => p !== '');
    
    if (patternParts.length !== pathParts.length) {
      return false;
    }
    
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }

  static _extractParams(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    const params = {};
    
    patternParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });
    
    return params;
  }

  static _parseQuery(queryString) {
    const params = {};
    
    if (!queryString) {
      return params;
    }
    
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) {
        params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
      }
    });
    
    return params;
  }

  static get routes() {
    return {
      '/': { component: 'employee-table' },
      '/new': { component: 'item-form' },
      '/edit/:id': { component: 'item-form' }
    };
  }

  render() {
    return html`<slot></slot>`;
  }
}

customElements.define('app-router', AppRouter);
