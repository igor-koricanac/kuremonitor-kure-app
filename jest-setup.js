// Jest setup provided by Grafana scaffolding
import './.config/jest-setup';
import React from 'react';

jest.mock('react-markdown', () => {
  function MockReactMarkdown({ children }) {
    return React.createElement('div', null, children);
  }
  return MockReactMarkdown;
});

if (typeof window !== 'undefined' && window.HTMLElement) {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
}
