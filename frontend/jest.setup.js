import '@testing-library/jest-dom'

// JSDOM does not implement window.matchMedia, so we provide a mock.
// By default, matches is false (no reduced motion), so components
// render their full animation path in tests.
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),    // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});
