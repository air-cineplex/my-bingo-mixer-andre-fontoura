import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('follows the system by default', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.themeMode).toBe('auto');
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });

  it('applies and removes explicit theme overrides', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setThemeMode('dark'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    act(() => result.current.setThemeMode('light'));
    expect(document.documentElement).toHaveAttribute('data-theme', 'light');

    act(() => result.current.setThemeMode('auto'));
    expect(document.documentElement).not.toHaveAttribute('data-theme');
  });
});