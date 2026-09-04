import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useBingoGame } from './useBingoGame';

const STORAGE_KEY = 'bingo-game-state';
const CORNER_IDS = [0, 4, 20, 24];

describe('useBingoGame', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('restores a persisted Four Corners winning line and its square IDs', () => {
    const board = Array.from({ length: 25 }, (_, id) => ({
      id,
      text: id === 12 ? 'Free' : `Question ${id}`,
      isMarked: id === 12 || CORNER_IDS.includes(id),
      isFreeSpace: id === 12,
    }));
    const winningLine = {
      type: 'corners' as const,
      index: 0,
      squares: CORNER_IDS,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: 1,
      gameState: 'bingo',
      board,
      winningLine,
    }));

    const { result } = renderHook(() => useBingoGame());

    expect(result.current.winningLine).toEqual(winningLine);
    expect(result.current.winningSquareIds).toEqual(new Set(CORNER_IDS));
  });
});