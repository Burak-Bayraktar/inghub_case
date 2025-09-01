import { html, fixture, expect } from '@open-wc/testing';
import { PageTitle } from '../src/components/page-title.js';
import '../src/components/page-title.js';

describe('PageTitle', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<page-title title="Test Title"></page-title>`);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(PageTitle);
    });

    it('should be defined as custom element', () => {
      const elementConstructor = customElements.get('page-title');
      expect(elementConstructor).to.equal(PageTitle);
    });

    it('should initialize with empty title by default', async () => {
      const defaultElement = await fixture(html`<page-title></page-title>`);
      expect(defaultElement.title).to.equal('');
    });
  });

  describe('title property', () => {
    it('should display the provided title', () => {
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent).to.equal('Test Title');
    });

    it('should update when title changes', async () => {
      element.title = 'New Title';
      await element.updateComplete;
      
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent).to.equal('New Title');
    });

    it('should handle empty title', async () => {
      element.title = '';
      await element.updateComplete;
      
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent).to.equal('');
    });

    it('should handle special characters in title', async () => {
      element.title = 'Çalışan Listesi & Düzenleme';
      await element.updateComplete;
      
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent).to.equal('Çalışan Listesi & Düzenleme');
    });
  });

  describe('styling', () => {
    it('should have defined styles', () => {
      expect(PageTitle.styles).to.exist;
    });

    it('should have proper CSS classes', () => {
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.classList.contains('page-title')).to.be.true;
    });

    it('should support inline attribute', async () => {
      const inlineElement = await fixture(html`<page-title title="Inline" inline></page-title>`);
      expect(inlineElement.hasAttribute('inline')).to.be.true;
    });

    it('should have responsive styles', () => {
      const styles = PageTitle.styles.cssText;
      expect(styles).to.include('@media');
      expect(styles).to.include('max-width: 768px');
    });

    it('should have color styling', () => {
      const styles = PageTitle.styles.cssText;
      expect(styles).to.include('#ff6200');
    });
  });

  describe('rendering', () => {
    it('should render h2 element', () => {
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2).to.exist;
      expect(h2.tagName.toLowerCase()).to.equal('h2');
    });

    it('should only render one h2 element', () => {
      const h2Elements = element.shadowRoot.querySelectorAll('h2');
      expect(h2Elements.length).to.equal(1);
    });
  });

  describe('accessibility', () => {
    it('should use semantic h2 element', () => {
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.tagName.toLowerCase()).to.equal('h2');
    });

    it('should have readable text content', () => {
      const h2 = element.shadowRoot.querySelector('h2');
      expect(h2.textContent.trim()).to.not.be.empty;
    });
  });
});
