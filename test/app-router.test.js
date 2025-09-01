import { html, fixture, expect } from '@open-wc/testing';
import { AppRouter } from '../src/components/app-router.js';

describe('AppRouter', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<app-router></app-router>`);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(AppRouter);
    });

    it('should have default properties', () => {
      expect(element.currentRoute).to.equal('/');
      expect(element.routeParams).to.be.an('object');
    });

    it('should have correct routes configuration', () => {
      const routes = AppRouter.routes;
      expect(routes).to.be.an('object');
      expect(routes['/']).to.exist;
      expect(routes['/new']).to.exist;
      expect(routes['/edit/:id']).to.exist;
    });
  });

  describe('navigation functionality', () => {
    it('should navigate to a route', () => {
      const originalHash = window.location.hash;
      
      element.navigate('/test-route');
      
      expect(window.location.hash).to.equal('#/test-route');
      
      window.location.hash = originalHash;
    });

    it('should navigate to edit route with parameters', () => {
      const originalHash = window.location.hash;
      
      element.navigate('/edit', { id: '123' });
      
      expect(window.location.hash).to.equal('#/edit/123');
      
      window.location.hash = originalHash;
    });

    it('should navigate using static method', () => {
      const originalHash = window.location.hash;
      
      AppRouter.navigate('/test');
      
      expect(window.location.hash).to.equal('#/test');
      
      window.location.hash = originalHash;
    });

    it('should get current route', () => {
      const originalHash = window.location.hash;
      window.location.hash = '/test-path';
      
      const result = AppRouter.getCurrentRoute();
      expect(result.route).to.equal('/');
      
      window.location.hash = originalHash;
    });
  });

  describe('route matching', () => {
    it('should match exact routes', () => {
      const result = AppRouter._matchRoute('/', '/');
      expect(result).to.be.true;
    });

    it('should match parameterized routes', () => {
      const result = AppRouter._matchRoute('/edit/:id', '/edit/123');
      expect(result).to.be.true;
    });

    it('should not match different routes', () => {
      const result = AppRouter._matchRoute('/users', '/products');
      expect(result).to.be.false;
    });

    it('should not match routes with different lengths', () => {
      const result = AppRouter._matchRoute('/users/:id', '/users');
      expect(result).to.be.false;
    });
  });

  describe('parameter extraction', () => {
    it('should extract parameters from URL', () => {
      const params = AppRouter._extractParams('/edit/:id', '/edit/123');
      expect(params).to.deep.equal({ id: '123' });
    });

    it('should extract multiple parameters', () => {
      const params = AppRouter._extractParams('/users/:userId/posts/:postId', '/users/abc/posts/xyz');
      expect(params).to.deep.equal({ userId: 'abc', postId: 'xyz' });
    });

    it('should return empty object for routes without parameters', () => {
      const params = AppRouter._extractParams('/home', '/home');
      expect(params).to.deep.equal({});
    });
  });

  describe('query parsing', () => {
    it('should parse query parameters', () => {
      const query = AppRouter._parseQuery('name=John&age=30');
      expect(query).to.deep.equal({ name: 'John', age: '30' });
    });

    it('should handle empty query string', () => {
      const query = AppRouter._parseQuery('');
      expect(query).to.deep.equal({});
    });

    it('should handle single parameter', () => {
      const query = AppRouter._parseQuery('search=test');
      expect(query).to.deep.equal({ search: 'test' });
    });

    it('should handle encoded parameters', () => {
      const query = AppRouter._parseQuery('message=Hello%20World');
      expect(query).to.deep.equal({ message: 'Hello World' });
    });

    it('should handle parameters without values', () => {
      const query = AppRouter._parseQuery('debug&verbose');
      expect(query).to.deep.equal({ debug: '', verbose: '' });
    });
  });

  describe('hash change handling', () => {
    it('should handle hash change event', (done) => {
      const originalHash = window.location.hash;
      let eventReceived = false;
      
      const handler = (e) => {
        if (!eventReceived) {
          eventReceived = true;
          expect(e.detail.route).to.be.a('string');
          expect(e.detail.params).to.be.an('object');
          
          element.removeEventListener('route-changed', handler);
          window.location.hash = originalHash;
          done();
        }
      };
      
      element.addEventListener('route-changed', handler);

      setTimeout(() => {
        window.location.hash = '/new';
      }, 10);
    });

    it('should extract route parameters from hash', (done) => {
      const originalHash = window.location.hash;
      let eventReceived = false;
      
      const handler = (e) => {
        if (!eventReceived && e.detail.route === '/edit') {
          eventReceived = true;
          expect(e.detail.params.id).to.equal('456');
          
          element.removeEventListener('route-changed', handler);
          window.location.hash = originalHash;
          done();
        }
      };
      
      element.addEventListener('route-changed', handler);

      setTimeout(() => {
        window.location.hash = '/edit/456';
      }, 10);
    });
  });

  describe('route rendering', () => {
    it('should render slot content', async () => {
      const content = element.shadowRoot.querySelector('slot');
      expect(content).to.exist;
    });
  });

  describe('edge cases', () => {
    it('should handle routes with different part counts', () => {
      const result = AppRouter._matchRoute('/edit/:id', '/edit/');
      expect(result).to.be.false;
    });

    it('should handle special characters in parameters', () => {
      const params = AppRouter._extractParams('/search/:term', '/search/hello%20world');
      expect(params.term).to.equal('hello%20world');
    });

    it('should handle empty route patterns', () => {
      const result = AppRouter._matchRoute('', '/test');
      expect(result).to.be.false;
    });

    it('should handle complex query strings', () => {
      const query = AppRouter._parseQuery('filter[name]=John&filter[age]=30&sort=asc');
      expect(query['filter[name]']).to.equal('John');
      expect(query['filter[age]']).to.equal('30');
      expect(query.sort).to.equal('asc');
    });

    it('should handle getCurrentRoute with query parameters', () => {
      const originalHash = window.location.hash;
      window.location.hash = '/new?test=value';
      
      const result = AppRouter.getCurrentRoute();
      expect(result.route).to.equal('/new');
      expect(result.query.test).to.equal('value');
      
      window.location.hash = originalHash;
    });
  });
});