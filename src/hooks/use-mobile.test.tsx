
import { useIsMobile } from './use-mobile';
import { renderHook } from '@testing-library/react';
import { expect, vi, test, beforeEach } from 'vitest';

beforeEach(() => {
  vi.clearAllMocks();
});

test('useIsMobile returns true when window width is less than 768', () => {
  const matchMediaMock = vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const isMobile = query === '(max-width: 767px)' && window.innerWidth < 768;
    return {
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  });
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(true);
  matchMediaMock.mockRestore();
});

test('useIsMobile returns false when window width is 768 or more', () => {
  const matchMediaMock = vi.spyOn(window, 'matchMedia').mockImplementation((query) => {
    const isMobile = query === '(max-width: 767px)' && window.innerWidth < 768;
    return {
      matches: isMobile,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
  });
  Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
  const { result } = renderHook(() => useIsMobile());
  expect(result.current).toBe(false);
  matchMediaMock.mockRestore();
});