let testIdCounter = 1;

export class MockStore {
  constructor() {
    this.state = {
      employees: {
        employees: [],
        viewMode: 'list'
      }
    };
    this.listeners = [];
    testIdCounter = 1;
  }

  getState() {
    return this.state;
  }

  dispatch(action) {
    switch (action.type) {
      case 'employees/addEmployee': {
        const employee = {
          id: (testIdCounter++).toString(),
          ...action.payload
        };
        this.state.employees.employees.push(employee);
        break;
      }
      case 'employees/updateEmployee': {
        const updateIndex = this.state.employees.employees.findIndex(emp => emp.id === action.payload.id);
        if (updateIndex >= 0) {
          this.state.employees.employees[updateIndex] = { 
            ...this.state.employees.employees[updateIndex], 
            ...action.payload 
          };
        }
        break;
      }
      case 'employees/deleteEmployee': {
        this.state.employees.employees = this.state.employees.employees.filter(emp => emp.id !== action.payload);
        break;
      }
      case 'employees/setViewMode': {
        this.state.employees.viewMode = action.payload;
        break;
      }
      case 'employees/reset': {
        this.state.employees.employees = [];
        this.state.employees.viewMode = 'list';
        break;
      }
    }
    this.notifyListeners();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener());
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('reduxState', JSON.stringify(this.state));
    }
  }

  reset() {
    testIdCounter = 1;
    this.state = {
      employees: {
        employees: [],
        viewMode: 'list'
      }
    };
    this.notifyListeners();
  }
}

export const mockStore = new MockStore();

export function setupMockStore() {
  window.__MOCK_STORE__ = mockStore;
  
  const mockStorage = {};
  const localStorageMock = {
    getItem: (key) => mockStorage[key] || null,
    setItem: (key, value) => { mockStorage[key] = value; },
    removeItem: (key) => { delete mockStorage[key]; },
    clear: () => { 
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    }
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true
  });
  
  return mockStore;
}
