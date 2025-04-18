import { cn } from './utils';
import { expect, test } from 'vitest';

test('combine class names', () => {
  const result = cn('class1', 'class2', 'class3');
  expect(result).toBe('class1 class2 class3');
});

test('handle conditional class names', () => {
  const result1 = cn('class1', true && 'class2', false && 'class3');
  expect(result1).toBe('class1 class2');

  const result2 = cn('class1', false && 'class2', true && 'class3');
  expect(result2).toBe('class1 class3');

  const result3 = cn('class1', true && 'class2', true && 'class3');
  expect(result3).toBe('class1 class2 class3');
});