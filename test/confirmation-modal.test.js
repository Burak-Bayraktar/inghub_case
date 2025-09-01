import { html, fixture, expect, nextFrame } from '@open-wc/testing';
import { ConfirmationModal } from '../src/components/confirmation-modal.js';
import '../src/components/confirmation-modal.js';

describe('ConfirmationModal', () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<confirmation-modal></confirmation-modal>`);
    await nextFrame();
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(ConfirmationModal);
    });

    it('should extend LocalizedComponent', () => {
      const proto = Object.getPrototypeOf(Object.getPrototypeOf(element));
      expect(proto.constructor.name).to.equal('LocalizedComponent');
    });

    it('should initialize with default properties', () => {
      expect(element.title).to.equal('');
      expect(element.message).to.equal('');
      expect(element.open).to.be.false;
      expect(element.confirmText).to.be.a('string');
      expect(element.cancelText).to.be.a('string');
    });

    it('should be defined as custom element', () => {
      const elementConstructor = customElements.get('confirmation-modal');
      expect(elementConstructor).to.equal(ConfirmationModal);
    });
  });

  describe('properties', () => {
    it('should set title property', async () => {
      element.title = 'Test Title';
      await element.updateComplete;
      
      const titleElement = element.shadowRoot.querySelector('.modal-title');
      expect(titleElement.textContent).to.equal('Test Title');
    });

    it('should set message property', async () => {
      element.message = 'Test message content';
      await element.updateComplete;
      
      const messageElement = element.shadowRoot.querySelector('.modal-message');
      expect(messageElement.textContent).to.equal('Test message content');
    });

    it('should set confirmText property', async () => {
      element.confirmText = 'Custom Confirm';
      await element.updateComplete;
      
      const confirmBtn = element.shadowRoot.querySelector('.btn-danger');
      expect(confirmBtn.textContent.trim()).to.equal('Custom Confirm');
    });

    it('should set cancelText property', async () => {
      element.cancelText = 'Custom Cancel';
      await element.updateComplete;
      
      const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');
      expect(cancelBtn.textContent.trim()).to.equal('Custom Cancel');
    });

    it('should reflect open property', async () => {
      element.open = true;
      await element.updateComplete;
      expect(element.hasAttribute('open')).to.be.true;
      
      element.open = false;
      await element.updateComplete;
      expect(element.hasAttribute('open')).to.be.false;
    });
  });

  describe('visibility', () => {
    it('should be hidden by default', () => {
      const computedStyle = getComputedStyle(element);
      expect(computedStyle.display).to.equal('none');
    });

    it('should show when open is true', async () => {
      element.open = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('open')).to.be.true;
    });

    it('should hide when open is false', async () => {
      element.open = true;
      await element.updateComplete;
      
      element.open = false;
      await element.updateComplete;
      
      expect(element.hasAttribute('open')).to.be.false;
    });
  });

  describe('rendering', () => {
    beforeEach(async () => {
      element.title = 'Test Modal';
      element.message = 'This is a test message';
      element.confirmText = 'Confirm';
      element.cancelText = 'Cancel';
      element.open = true;
      await element.updateComplete;
    });

    it('should render modal structure', () => {
      const modal = element.shadowRoot.querySelector('.modal');
      expect(modal).to.exist;
    });

    it('should render header with title', () => {
      const header = element.shadowRoot.querySelector('.modal-header');
      expect(header).to.exist;
      
      const title = header.querySelector('.modal-title');
      expect(title.textContent).to.equal('Test Modal');
    });

    it('should render close button in header', () => {
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      expect(closeBtn).to.exist;
      expect(closeBtn.textContent).to.equal('×');
    });

    it('should render body with message', () => {
      const body = element.shadowRoot.querySelector('.modal-body');
      expect(body).to.exist;
      
      const message = body.querySelector('.modal-message');
      expect(message.textContent).to.equal('This is a test message');
    });

    it('should render footer with buttons', () => {
      const footer = element.shadowRoot.querySelector('.modal-footer');
      expect(footer).to.exist;
      
      const buttons = footer.querySelectorAll('.btn');
      expect(buttons).to.have.lengthOf(2);
    });

    it('should render cancel button first', () => {
      const buttons = element.shadowRoot.querySelectorAll('.btn');
      const cancelBtn = buttons[0];
      
      expect(cancelBtn.classList.contains('btn-secondary')).to.be.true;
      expect(cancelBtn.textContent.trim()).to.equal('Cancel');
    });

    it('should render confirm button second', () => {
      const buttons = element.shadowRoot.querySelectorAll('.btn');
      const confirmBtn = buttons[1];
      
      expect(confirmBtn.classList.contains('btn-danger')).to.be.true;
      expect(confirmBtn.textContent.trim()).to.equal('Confirm');
    });
  });

  describe('event handling', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should emit confirm event when confirm button is clicked', () => {
      let eventFired = false;
      element.addEventListener('confirm', () => {
        eventFired = true;
      });

      const confirmBtn = element.shadowRoot.querySelector('.btn-danger');
      confirmBtn.click();
      
      expect(eventFired).to.be.true;
    });

    it('should emit cancel event when cancel button is clicked', () => {
      let eventFired = false;
      element.addEventListener('cancel', () => {
        eventFired = true;
      });

      const cancelBtn = element.shadowRoot.querySelector('.btn-secondary');
      cancelBtn.click();
      
      expect(eventFired).to.be.true;
    });

    it('should emit cancel event when close button is clicked', () => {
      let eventFired = false;
      element.addEventListener('cancel', () => {
        eventFired = true;
      });

      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      closeBtn.click();
      
      expect(eventFired).to.be.true;
    });

    it('should emit bubbling and composed events', () => {
      let confirmEvent, cancelEvent;
      
      element.addEventListener('confirm', (e) => {
        confirmEvent = e;
      });
      
      element.addEventListener('cancel', (e) => {
        cancelEvent = e;
      });

      element._onConfirm();
      element._onCancel();
      
      expect(confirmEvent.bubbles).to.be.true;
      expect(confirmEvent.composed).to.be.true;
      expect(cancelEvent.bubbles).to.be.true;
      expect(cancelEvent.composed).to.be.true;
    });
  });

  describe('backdrop interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should handle backdrop click', () => {
      let cancelFired = false;
      element.addEventListener('cancel', () => {
        cancelFired = true;
      });

      const backdrop = element.shadowRoot.querySelector('div');
      const event = new Event('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: backdrop });
      Object.defineProperty(event, 'currentTarget', { value: backdrop });
      
      element._onBackdropClick(event);
      
      expect(cancelFired).to.be.true;
    });

    it('should not close when clicking inside modal', () => {
      let cancelFired = false;
      element.addEventListener('cancel', () => {
        cancelFired = true;
      });

      const modal = element.shadowRoot.querySelector('.modal');
      const backdrop = element.shadowRoot.querySelector('div');
      const event = new Event('click', { bubbles: true });
      Object.defineProperty(event, 'target', { value: modal });
      Object.defineProperty(event, 'currentTarget', { value: backdrop });
      
      element._onBackdropClick(event);
      
      expect(cancelFired).to.be.false;
    });
  });

  describe('styles', () => {
    it('should have defined styles', () => {
      expect(ConfirmationModal.styles).to.exist;
    });

    it('should have modal animation styles', () => {
      const styles = ConfirmationModal.styles.cssText;
      expect(styles).to.include('@keyframes modalAppear');
      expect(styles).to.include('animation: modalAppear');
    });

    it('should have overlay styles when open', () => {
      const styles = ConfirmationModal.styles.cssText;
      expect(styles).to.include(':host([open])');
      expect(styles).to.include('position: fixed');
      expect(styles).to.include('background: rgba(0, 0, 0, 0.5)');
    });

    it('should have button hover effects', () => {
      const styles = ConfirmationModal.styles.cssText;
      expect(styles).to.include('.btn-secondary:hover');
      expect(styles).to.include('.btn-danger:hover');
      expect(styles).to.include('.close-btn:hover');
    });

    it('should have responsive modal styles', () => {
      const styles = ConfirmationModal.styles.cssText;
      expect(styles).to.include('max-width: 400px');
      expect(styles).to.include('width: 90%');
      expect(styles).to.include('max-height: 90vh');
    });
  });

  describe('accessibility', () => {
    beforeEach(async () => {
      element.title = 'Confirm Action';
      element.message = 'Are you sure you want to proceed?';
      element.open = true;
      await element.updateComplete;
    });

    it('should have proper semantic structure', () => {
      const title = element.shadowRoot.querySelector('.modal-title');
      expect(title.tagName.toLowerCase()).to.equal('h3');
    });

    it('should have accessible button labels', () => {
      const buttons = element.shadowRoot.querySelectorAll('.btn');
      buttons.forEach(button => {
        expect(button.textContent.trim()).to.not.be.empty;
      });
    });

    it('should have meaningful close button', () => {
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      expect(closeBtn.textContent).to.equal('×');
    });
  });

  describe('edge cases', () => {
    it('should handle empty title', async () => {
      element.title = '';
      await element.updateComplete;
      
      const title = element.shadowRoot.querySelector('.modal-title');
      expect(title.textContent).to.equal('');
    });

    it('should handle empty message', async () => {
      element.message = '';
      await element.updateComplete;
      
      const message = element.shadowRoot.querySelector('.modal-message');
      expect(message.textContent).to.equal('');
    });

    it('should handle very long title', async () => {
      const longTitle = 'A'.repeat(100);
      element.title = longTitle;
      await element.updateComplete;
      
      const title = element.shadowRoot.querySelector('.modal-title');
      expect(title.textContent).to.equal(longTitle);
    });

    it('should handle very long message', async () => {
      const longMessage = 'A'.repeat(500);
      element.message = longMessage;
      await element.updateComplete;
      
      const message = element.shadowRoot.querySelector('.modal-message');
      expect(message.textContent).to.equal(longMessage);
    });

    it('should handle multiple rapid open/close', async () => {
      element.open = true;
      await element.updateComplete;
      
      element.open = false;
      await element.updateComplete;
      
      element.open = true;
      await element.updateComplete;
      
      expect(element.hasAttribute('open')).to.be.true;
    });
  });

  describe('keyboard interaction', () => {
    beforeEach(async () => {
      element.open = true;
      await element.updateComplete;
    });

    it('should focus management could be implemented', () => {
      const focusableElements = element.shadowRoot.querySelectorAll('button');
      expect(focusableElements.length).to.be.greaterThan(0);
    });

    it('should have clickable close button', () => {
      const closeBtn = element.shadowRoot.querySelector('.close-btn');
      expect(closeBtn.type).to.equal('button');
    });

    it('should have clickable action buttons', () => {
      const buttons = element.shadowRoot.querySelectorAll('.btn');
      buttons.forEach(button => {
        expect(button.type).to.equal('button');
      });
    });
  });
});
