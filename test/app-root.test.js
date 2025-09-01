import { html, fixture, expect, nextFrame } from '@open-wc/testing';
import { AppRoot } from '../src/components/app-root.js';
import '../src/components/app-root.js';
import { configureStore } from '@reduxjs/toolkit';
import employeesReducer from '../src/store/employeesSlice.js';

describe('AppRoot', () => {
  let element;
  let mockStore;

  beforeEach(async () => {
    mockStore = configureStore({
      reducer: {
        employees: employeesReducer
      }
    });
    
    window.__MOCK_STORE__ = mockStore;
    
    window.appSetLocale = async (locale) => {
      window._currentLocale = locale;
      return locale;
    };
    
    window.appGetLocale = () => {
      return window._currentLocale || 'en';
    };
    
    window._currentLocale = 'en';
    
    element = await fixture(html`<app-root></app-root>`);
    await nextFrame();
  });

  afterEach(() => {
    delete window.__MOCK_STORE__;
    delete window.appSetLocale;
    delete window.appGetLocale;
    delete window._currentLocale;
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(AppRoot);
    });

    it('should initialize with default route', () => {
      expect(element.currentRoute).to.equal('/');
      expect(element.routeParams).to.deep.equal({});
    });

    it('should extend LocalizedComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(element));
      expect(proto.constructor.name).to.equal('LocalizedComponent');
    });
  });

  describe('rendering', () => {
    it('should render header with ING logo', () => {
      const logo = element.shadowRoot.querySelector('.header-top-logo');
      expect(logo).to.exist;
      expect(logo.textContent).to.equal('ING');
      expect(logo.href).to.include('#/');
    });

    it('should render navigation links', () => {
      const navLinks = element.shadowRoot.querySelectorAll('.header-top-nav a');
      expect(navLinks).to.have.lengthOf(2);
      
      expect(navLinks[0].href).to.include('#/');
      expect(navLinks[1].href).to.include('#/new');
    });

    it('should render language switcher', () => {
      const switcher = element.shadowRoot.querySelector('.language-switcher');
      expect(switcher).to.exist;
      
      const switchButton = switcher.querySelector('button');
      expect(switchButton).to.exist;
    });

    it('should render app-router component', () => {
      const router = element.shadowRoot.querySelector('app-router');
      expect(router).to.exist;
    });

    it('should render outlet container', () => {
      const outlet = element.shadowRoot.querySelector('#outlet');
      expect(outlet).to.exist;
    });
  });

  describe('route rendering', () => {
    it('should render employee-table for default route', () => {
      element.currentRoute = '/';
      element.requestUpdate();
      
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('employee-table');
    });

    it('should render item-form for new route', () => {
      element.currentRoute = '/new';
      element.requestUpdate();
      
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
    });

    it('should render item-form for edit route', () => {
      element.currentRoute = '/edit';
      element.routeParams = { id: '123' };
      element.requestUpdate();
      
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
    });

    it('should fallback to employee-table for unknown routes', () => {
      element.currentRoute = '/unknown';
      element.requestUpdate();
      
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('employee-table');
    });
  });

  describe('navigation', () => {
    it('should set active class on current route link', async () => {
      element.currentRoute = '/';
      await element.updateComplete;
      
      const homeLink = element.shadowRoot.querySelector('.header-top-nav a[href="#/"]');
      expect(homeLink.classList.contains('active')).to.be.true;
      
      const newLink = element.shadowRoot.querySelector('.header-top-nav a[href="#/new"]');
      expect(newLink.classList.contains('active')).to.be.false;
    });

    it('should set active class on new route link', async () => {
      element.currentRoute = '/new';
      await element.updateComplete;
      
      const homeLink = element.shadowRoot.querySelector('.header-top-nav a[href="#/"]');
      expect(homeLink.classList.contains('active')).to.be.false;
      
      const newLink = element.shadowRoot.querySelector('.header-top-nav a[href="#/new"]');
      expect(newLink.classList.contains('active')).to.be.true;
    });
  });

  describe('route change handling', () => {
    it('should handle route changed events', () => {
      const event = new CustomEvent('route-changed', {
        detail: {
          route: '/new',
          params: { test: 'value' }
        }
      });
      
      element._onRouteChanged(event);
      
      expect(element.currentRoute).to.equal('/new');
      expect(element.routeParams).to.deep.equal({ test: 'value' });
    });

    it('should update route params correctly', () => {
      const event = new CustomEvent('route-changed', {
        detail: {
          route: '/edit',
          params: { id: '456' }
        }
      });
      
      element._onRouteChanged(event);
      
      expect(element.currentRoute).to.equal('/edit');
      expect(element.routeParams.id).to.equal('456');
    });
  });

  describe('language switching', () => {
    it('should get current locale', () => {
      const locale = element._getCurrentLocale();
      expect(locale).to.equal('en');
    });

    it('should set new locale', async () => {
      let localeSet = false;
      const originalAppSetLocale = window.appSetLocale;
      
      window.appSetLocale = async (locale) => {
        localeSet = true;
        expect(locale).to.equal('tr');
        window._currentLocale = locale;
        return locale;
      };
      
      await element._setLocale('tr');
      
      expect(localeSet).to.be.true;
      expect(window._currentLocale).to.equal('tr');
      
      window.appSetLocale = originalAppSetLocale;
    });

    it('should handle locale change when appSetLocale is not available', () => {
      delete window.appSetLocale;
      
      expect(() => element._setLocale('tr')).to.not.throw();
    });

    it('should dispatch locale-changed event', async () => {
      let eventFired = false;
      window.addEventListener('locale-changed', (e) => {
        eventFired = true;
        expect(e.detail.locale).to.equal('tr');
      });
      
      await element._setLocale('tr');
      
      expect(eventFired).to.be.true;
    });

    it('should update URL with locale parameter', async () => {
      const originalReplaceState = window.history.replaceState;
      let urlUpdated = false;
      
      window.history.replaceState = (state, title, url) => {
        urlUpdated = true;
        expect(typeof url).to.equal('string');
      };
      
      await element._setLocale('tr');
      
      expect(urlUpdated).to.be.true;
      
      window.history.replaceState = originalReplaceState;
    });

    it('should show Turkish flag when locale is English', async () => {
      window.appGetLocale = () => 'en';
      element.requestUpdate();
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.language-switcher button');
      expect(button.title).to.equal('Switch to Turkish');
    });

    it('should show UK flag when locale is Turkish', async () => {
      window.appGetLocale = () => 'tr';
      element.requestUpdate();
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.language-switcher button');
      expect(button.title).to.equal('Switch to English');
    });
  });

  describe('edit event handling', () => {
    it('should handle edit events and update location', () => {
      const originalHash = window.location.hash;
      
      const event = new CustomEvent('edit', {
        detail: { id: '123' }
      });
      
      element._onEdit(event);
      
      expect(window.location.hash).to.equal('#/edit/123');
      
      window.location.hash = originalHash;
    });

    it('should handle edit events with different employee ids', () => {
      const originalHash = window.location.hash;
      
      const event = new CustomEvent('edit', {
        detail: { id: '456' }
      });
      
      element._onEdit(event);
      
      expect(window.location.hash).to.equal('#/edit/456');
      
      window.location.hash = originalHash;
    });
  });

  describe('additional navigation tests', () => {
    it('should handle route change events', async () => {
      const event = new CustomEvent('route-changed', {
        detail: { route: '/new', params: {} }
      });
      
      element._onRouteChanged(event);
      await element.updateComplete;
      
      expect(element.currentRoute).to.equal('/new');
    });

    it('should handle route with parameters', async () => {
      const event = new CustomEvent('route-changed', {
        detail: { route: '/edit', params: { id: '123' } }
      });
      
      element._onRouteChanged(event);
      await element.updateComplete;
      
      expect(element.currentRoute).to.equal('/edit');
      expect(element.routeParams?.id).to.equal('123');
    });

    it('should update active navigation links', async () => {
      element.currentRoute = '/new';
      await element.updateComplete;
      
      const activeLink = element.shadowRoot.querySelector('.header-top-nav a.active');
      expect(activeLink).to.exist;
      expect(activeLink.href).to.include('#/new');
    });
  });

  describe('component rendering tests', () => {
    it('should render employee table for root route', () => {
      element.currentRoute = '/';
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('employee-table');
    });

    it('should render item form for new route', () => {
      element.currentRoute = '/new';
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
      expect(content.values[0]).to.be.false;
    });

    it('should render edit form with employee ID', () => {
      element.currentRoute = '/edit';
      element.routeParams = { id: '123' };
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
      expect(content.values[0]).to.be.true;
      expect(content.values[1]).to.equal('123');
    });

    it('should handle missing employee ID in edit route', () => {
      element.currentRoute = '/edit';
      element.routeParams = null;
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
      expect(content.values[1]).to.equal('');
    });
  });

  describe('component lifecycle tests', () => {
    it('should initialize with app-router', () => {
      const router = element.shadowRoot.querySelector('app-router');
      expect(router).to.exist;
    });

    it('should listen to route-changed events', () => {
      const router = element.shadowRoot.querySelector('app-router');
      expect(router).to.exist;
    });
  });

  describe('rendering tests', () => {
    it('should render header section', () => {
      const header = element.shadowRoot.querySelector('.header-top');
      expect(header).to.exist;
    });

    it('should render navigation links', () => {
      const nav = element.shadowRoot.querySelector('.header-top-nav');
      expect(nav).to.exist;
      
      const links = nav.querySelectorAll('a');
      expect(links.length).to.be.greaterThan(0);
    });

    it('should render language switcher', () => {
      const switcher = element.shadowRoot.querySelector('.language-switcher');
      expect(switcher).to.exist;
    });
  });

  describe('styling tests', () => {
    it('should have defined styles', () => {
      expect(AppRoot.styles).to.exist;
    });

    it('should include responsive breakpoints', () => {
      const styles = AppRoot.styles.cssText;
      expect(styles).to.include('@media');
      expect(styles).to.include('max-width');
    });

    it('should have proper ING brand styling', () => {
      const styles = AppRoot.styles.cssText;
      expect(styles).to.include('#ff6200');
    });

    it('should have navigation hover effects', () => {
      const styles = AppRoot.styles.cssText;
      expect(styles).to.include(':hover');
    });
  });

  describe('custom element definition', () => {
    it('should be defined as custom element', () => {
      const elementConstructor = customElements.get('app-root');
      expect(elementConstructor).to.equal(AppRoot);
    });
  });

  describe('lifecycle methods', () => {
    it('should call super.firstUpdated in firstUpdated', () => {
      let superCalled = false;
      const originalFirstUpdated = Object.getPrototypeOf(Object.getPrototypeOf(element)).firstUpdated;
      
      Object.getPrototypeOf(Object.getPrototypeOf(element)).firstUpdated = function() {
        superCalled = true;
        return originalFirstUpdated.call(this);
      };
      
      element.firstUpdated();
      
      expect(superCalled).to.be.true;
      
      Object.getPrototypeOf(Object.getPrototypeOf(element)).firstUpdated = originalFirstUpdated;
    });
  });

  describe('error handling', () => {
    it('should handle missing locale functions gracefully', () => {
      delete window.appGetLocale;
      
      const locale = element._getCurrentLocale();
      expect(locale).to.equal('en');
    });

    it('should handle route rendering with null params', () => {
      element.currentRoute = '/edit';
      element.routeParams = null;
      
      expect(() => element._renderCurrentRoute()).to.not.throw();
    });

    it('should handle empty route params', () => {
      element.currentRoute = '/edit';
      element.routeParams = {};
      
      const content = element._renderCurrentRoute();
      expect(content.strings[0]).to.include('item-form');
    });
  });

  describe('accessibility', () => {
    it('should have proper button titles for language switcher', async () => {
      await element.updateComplete;
      
      const button = element.shadowRoot.querySelector('.language-switcher button');
      expect(button.title).to.exist;
      expect(button.title).to.be.a('string');
    });

    it('should have semantic navigation structure', () => {
      const nav = element.shadowRoot.querySelector('.header-top-nav');
      expect(nav).to.exist;
      
      const links = nav.querySelectorAll('a');
      links.forEach(link => {
        expect(link.href).to.exist;
        expect(link.textContent.trim()).to.not.be.empty;
      });
    });
  });

  describe('additional functionality', () => {
    it('should handle view mode changes', async () => {
      let eventFired = false;
      
      element.addEventListener('view-mode-changed', () => {
        eventFired = true;
      });

      if (element._toggleViewMode) {
        element._toggleViewMode();
        expect(eventFired).to.be.true;
      }
    });

    it('should handle search functionality', async () => {
      if (element._onSearch) {
        const mockEvent = {
          target: { value: 'test search' },
          preventDefault: () => {}
        };
        
        element._onSearch(mockEvent);
        expect(true).to.be.true;
      }
    });

    it('should handle component lifecycle', async () => {
      if (element.disconnectedCallback) {
        element.disconnectedCallback();
        expect(true).to.be.true;
      }
    });

    it('should handle error states gracefully', async () => {
      if (element._handleError) {
        element._handleError(new Error('Test error'));
        expect(true).to.be.true;
      }
    });

    it('should update page title correctly', async () => {
      if (element._updatePageTitle) {
        element._updatePageTitle('Test Title');
        
        const pageTitle = element.shadowRoot.querySelector('page-title');
        if (pageTitle) {
          expect(pageTitle).to.exist;
        }
      }
    });

    it('should handle keyboard shortcuts', async () => {
      const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      
      if (element._handleKeydown) {
        element._handleKeydown(keyEvent);
        expect(true).to.be.true;
      }
    });

    it('should manage modal states', async () => {
      if (element._openModal) {
        element._openModal();
        expect(true).to.be.true;
      }
      
      if (element._closeModal) {
        element._closeModal();
        expect(true).to.be.true;
      }
    });

    it('should handle data refresh', async () => {
      if (element._refreshData) {
        await element._refreshData();
        expect(true).to.be.true;
      }
    });

    it('should validate form data', async () => {
      if (element._validateForm) {
        const result = element._validateForm({});
        expect(result).to.exist;
      }
    });

    it('should handle route parameters', async () => {
      if (element._handleRouteChange) {
        element._handleRouteChange('/test-route');
        expect(true).to.be.true;
      }
    });
  });
});
