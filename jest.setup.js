import '@testing-library/jest-native/extend-expect';
import { jest } from '@jest/globals';

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock para @react-native-async-storage/async-storage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock para @env
jest.mock('@env', () => ({
  API_URL: 'https://mock-api-url.com',
}));

// Silenciar los warnings de console.error y console.warn durante las pruebas
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  if (
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('Error:') ||
    /Warning.*not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  if (
    args[0]?.includes?.('Warning:') ||
    /Warning.*not wrapped in act/.test(args[0])
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

// Limpiar todos los mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});