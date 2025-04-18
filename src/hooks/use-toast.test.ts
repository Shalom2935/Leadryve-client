import { useToast, toast } from './use-toast';
import { renderHook, act } from '@testing-library/react';
import { expect, test, beforeEach, vi } from 'vitest';

beforeEach(() => {
  const { result } = renderHook(() => useToast());
  act(() => {
    result.current.dismiss();
  });
});

test('should add a toast', () => {
  const { result } = renderHook(() => useToast());
  act(() => {
    toast({});
  });
  expect(result.current.toasts.length).toBe(1);
  expect(result.current.toasts[0].id).toBeDefined();
  expect(result.current.toasts[0].open).toBe(true);
});

test('should update a toast', () => {
  const { result } = renderHook(() => useToast());
  let update: (props: any) => void;
  act(() => {
    const t = toast({});
    update = t.update;
  });
  expect(result.current.toasts.length).toBe(1);
  const id = result.current.toasts[0].id;
  act(() => {
    update({ id, title: 'New Title' });
  });
  expect(result.current.toasts[0].title).toBe('New Title');
});

test('should dismiss a toast', () => {
  const { result } = renderHook(() => useToast());
  let dismiss: () => void;
  act(() => {
    const t = toast({});
    dismiss = t.dismiss;
  });
  expect(result.current.toasts.length).toBe(1);
  const id = result.current.toasts[0].id;
  act(() => {
    dismiss();
  });
  expect(result.current.toasts[0].open).toBe(false);
});

test('should dismiss a toast by id', () => {
  const { result } = renderHook(() => useToast());
  act(() => {
    toast({});
  });
  expect(result.current.toasts.length).toBe(1);
  const id = result.current.toasts[0].id;
  act(() => {
    result.current.dismiss(id);
  });
  expect(result.current.toasts[0].open).toBe(false);
});

test('should remove a toast', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useToast());
  act(() => {
    toast({});
  });
  expect(result.current.toasts.length).toBe(1);
  const id = result.current.toasts[0].id;
  act(() => {
    result.current.dismiss(id);
    vi.advanceTimersByTime(1000000);
  });
  expect(result.current.toasts.length).toBe(0);
  vi.useRealTimers();
});

test('should enforce toast limit', () => {
  const { result } = renderHook(() => useToast());
  act(() => {
    toast({});
    toast({});
  });
  expect(result.current.toasts.length).toBe(1);
  act(() => {
    result.current.dismiss();
  });
  act(() => {
    toast({});
  });
  expect(result.current.toasts.length).toBe(1);
});
