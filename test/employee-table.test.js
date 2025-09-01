import { html, fixture, expect } from '@open-wc/testing';
import { EmployeeTable } from '../src/components/employee-table.js';
import { EmployeeService } from '../src/services/employee-service.js';

describe('EmployeeTable', () => {
  let element;

  beforeEach(async () => {
    EmployeeService.store = null;
    element = await fixture(html`<employee-table></employee-table>`);
  });

  describe('initialization', () => {
    it('should be defined', () => {
      expect(element).to.be.instanceOf(EmployeeTable);
    });

    it('should have default properties', () => {
      expect(element.currentPage).to.equal(1);
      expect(element.pageSize).to.equal(9);
      expect(element.selectedIds).to.be.an('array');
      expect(element.searchTerm).to.equal('');
    });
  });

  describe('search functionality', () => {
    it('should render search input', async () => {
      await element.updateComplete;
      const searchInput = element.shadowRoot.querySelector('.search-input');
      expect(searchInput).to.exist;
      expect(searchInput.placeholder).to.include('Search');
    });

    it('should update search term on input', async () => {
      await element.updateComplete;
      const searchInput = element.shadowRoot.querySelector('.search-input');
      
      searchInput.value = 'test search';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(element.searchTerm).to.equal('test search');
    });

    it('should reset to first page when searching', async () => {
      element.currentPage = 3;
      await element.updateComplete;
      
      const searchInput = element.shadowRoot.querySelector('.search-input');
      searchInput.value = 'search term';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(element.currentPage).to.equal(1);
    });

    it('should call _loadEmployeeData when search changes', async () => {
      let loadDataCalled = false;
      element._loadEmployeeData = () => {
        loadDataCalled = true;
      };
      
      await element.updateComplete;
      const searchInput = element.shadowRoot.querySelector('.search-input');
      searchInput.value = 'test';
      searchInput.dispatchEvent(new Event('input'));
      
      expect(loadDataCalled).to.be.true;
    });
  });

  describe('view mode switching', () => {
    it('should render view switcher buttons', async () => {
      await element.updateComplete;
      const viewSwitcher = element.shadowRoot.querySelector('.view-switcher');
      expect(viewSwitcher).to.exist;
      
      const buttons = viewSwitcher.querySelectorAll('button');
      expect(buttons).to.have.lengthOf(2);
    });

    it('should highlight active view mode', async () => {
      element.viewMode = 'list';
      await element.updateComplete;
      
      const listButton = element.shadowRoot.querySelector('.view-switcher button');
      expect(listButton.classList.contains('active')).to.be.true;
    });
  });

  describe('pagination', () => {
    it('should show pagination when there are multiple pages', async () => {
      element.totalRows = 20;
      element.pageSize = 9;
      await element.updateComplete;
      
      const pagination = element.shadowRoot.querySelector('app-pagination');
      expect(pagination).to.exist;
    });

    it('should hide pagination when there is only one page', async () => {
      element.totalRows = 5;
      element.pageSize = 9;
      await element.updateComplete;
      
      const pagination = element.shadowRoot.querySelector('pagination-component');
      expect(pagination).to.not.exist;
    });
  });

  describe('empty state', () => {
    it('should show empty state when no employees', async () => {
      element.totalRows = 0;
      element.rows = [];
      await element.updateComplete;
      
      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
    });

    it('should show appropriate empty message for search', async () => {
      element.totalRows = 0;
      element.rows = [];
      element.searchTerm = 'nonexistent';
      await element.updateComplete;
      
      const emptyState = element.shadowRoot.querySelector('.empty-state');
      expect(emptyState).to.exist;
    });
  });

  describe('employee rendering', () => {
    beforeEach(() => {
      element.rows = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          position: 'Developer',
          department: 'IT',
          phone: '+90 555 123 4567',
          dateHired: '2023-01-15'
        }
      ];
      element.totalRows = 1;
    });

    it('should render employee data in table view', async () => {
      element.viewMode = 'table';
      await element.updateComplete;
      
      const tableView = element.shadowRoot.querySelector('employee-table-view');
      expect(tableView).to.exist;
    });

    it('should render employee data in list view', async () => {
      element.viewMode = 'list';
      await element.updateComplete;
      
      const listView = element.shadowRoot.querySelector('employee-list-view');
      expect(listView).to.exist;
    });
  });

  describe('delete functionality', () => {
    it('should handle delete confirmation', async () => {
      element.showDeleteModal = true;
      element.employeeToDelete = { id: '1', firstName: 'John', lastName: 'Doe' };
      await element.updateComplete;
      
      const modal = element.shadowRoot.querySelector('confirmation-modal');
      expect(modal).to.exist;
    });

    it('should close delete modal on cancel', async () => {
      element.showDeleteModal = true;
      await element.updateComplete;
      
      const modal = element.shadowRoot.querySelector('confirmation-modal');
      modal.dispatchEvent(new CustomEvent('cancel'));
      
      expect(element.showDeleteModal).to.be.false;
    });
  });
});
