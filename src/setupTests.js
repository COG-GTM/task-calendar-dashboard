// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

window.matchMedia = window.matchMedia || function(query) {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

global.ResizeObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = jest.fn((element, pseudoElement) => {
  const baseStyle = {
    getPropertyValue: jest.fn((prop) => {
      const defaults = {
        'overflow-x': 'visible',
        'overflow-y': 'visible',
        'scrollbar-color': 'auto',
        'scrollbar-width': 'auto',
        'display': 'block',
        'visibility': 'visible',
        'opacity': '1',
        'width': '0px',
        'height': '0px'
      };
      return defaults[prop] || '';
    }),
    display: 'block',
    visibility: 'visible',
    opacity: '1',
    overflow: 'visible',
    overflowX: 'visible',
    overflowY: 'visible',
    scrollbarColor: 'auto',
    scrollbarWidth: 'auto',
    width: '0px',
    height: '0px'
  };
  
  if (pseudoElement === '::-webkit-scrollbar') {
    return {
      ...baseStyle,
      width: '0px',
      height: '0px'
    };
  }
  
  return baseStyle;
});

global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
  configurable: true,
  value: 100,
});

Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
  configurable: true,
  value: 100,
});

Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
  configurable: true,
  value: 100,
});

Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
  configurable: true,
  value: 100,
});

Object.defineProperty(document.documentElement, 'style', {
  value: {
    scrollbarColor: 'auto',
    scrollbarWidth: 'auto',
    overflowX: 'visible',
    overflowY: 'visible',
  },
  writable: true,
});

Object.defineProperty(document.body, 'style', {
  value: {
    overflowX: 'visible',
    overflowY: 'visible',
    scrollbarColor: 'auto',
    scrollbarWidth: 'auto',
  },
  writable: true,
});

Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
  configurable: true,
  value: 100,
});

Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
  configurable: true,
  value: 100,
});
