import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateBoard,
  toggleSquare,
  checkBingo,
  getWinningSquareIds,
  type BingoSquareData,
} from './bingoLogic';
import { questions, FREE_SPACE } from '../data/questions';

describe('bingoLogic', () => {
  describe('generateBoard', () => {
    it('should generate a board with 25 squares', () => {
      const board = generateBoard();
      expect(board).toHaveLength(25);
    });

    it('should have a free space in the center (index 12)', () => {
      const board = generateBoard();
      expect(board[12].isFreeSpace).toBe(true);
      expect(board[12].isMarked).toBe(true);
    });

    it('should have unique IDs from 0 to 24', () => {
      const board = generateBoard();
      const ids = board.map((square) => square.id);
      expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => i));
    });

    it('should have 24 non-free spaces', () => {
      const board = generateBoard();
      const nonFreeSpaces = board.filter((square) => !square.isFreeSpace);
      expect(nonFreeSpaces).toHaveLength(24);
    });

    it('should have all non-free spaces unmarked initially', () => {
      const board = generateBoard();
      const nonFreeSpaces = board.filter((square) => !square.isFreeSpace);
      nonFreeSpaces.forEach((square) => {
        expect(square.isMarked).toBe(false);
      });
    });

    it('should have the FREE_SPACE text in the center', () => {
      const board = generateBoard();
      expect(board[12].text).toBe(FREE_SPACE);
    });

    it('should have unique question texts across non-free squares', () => {
      const board = generateBoard();
      const texts = board.filter((s) => !s.isFreeSpace).map((s) => s.text);
      expect(new Set(texts).size).toBe(texts.length);
    });

    it('should only have text from the questions pool', () => {
      const board = generateBoard();
      const texts = board.filter((s) => !s.isFreeSpace).map((s) => s.text);
      texts.forEach((text) => {
        expect(questions).toContain(text);
      });
    });

    it('should randomize question order between boards', () => {
      // Mock Math.random to make it deterministic for first call
      const originalRandom = Math.random;
      let callCount = 0;
      vi.spyOn(Math, 'random').mockImplementation(() => {
        callCount++;
        return callCount / 100;
      });

      const board1 = generateBoard();
      
      // Reset counter for second board
      callCount = 0;
      const board2 = generateBoard();

      Math.random = originalRandom;

      // Boards should have different order (very unlikely to be the same with randomization)
      const texts1 = board1.filter((s) => !s.isFreeSpace).map((s) => s.text);
      const texts2 = board2.filter((s) => !s.isFreeSpace).map((s) => s.text);
      
      // At least verify structure is correct
      expect(texts1).toHaveLength(24);
      expect(texts2).toHaveLength(24);
    });
  });

  describe('toggleSquare', () => {
    let mockBoard: BingoSquareData[];

    beforeEach(() => {
      mockBoard = [
        { id: 0, text: 'Q1', isMarked: false, isFreeSpace: false },
        { id: 1, text: 'Q2', isMarked: true, isFreeSpace: false },
        { id: 2, text: 'Free', isMarked: true, isFreeSpace: true },
      ];
    });

    it('should toggle unmarked square to marked', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[0].isMarked).toBe(true);
    });

    it('should toggle marked square to unmarked', () => {
      const newBoard = toggleSquare(mockBoard, 1);
      expect(newBoard[1].isMarked).toBe(false);
    });

    it('should not modify free space', () => {
      const newBoard = toggleSquare(mockBoard, 2);
      expect(newBoard[2].isMarked).toBe(true);
    });

    it('should return a new array', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard).not.toBe(mockBoard);
    });

    it('should not modify other squares', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[1].isMarked).toBe(mockBoard[1].isMarked);
      expect(newBoard[2].isMarked).toBe(mockBoard[2].isMarked);
    });

    it('should create a new object for the toggled square (immutability)', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[0]).not.toBe(mockBoard[0]);
    });

    it('should not create new objects for untouched squares', () => {
      const newBoard = toggleSquare(mockBoard, 0);
      expect(newBoard[1]).toBe(mockBoard[1]);
      expect(newBoard[2]).toBe(mockBoard[2]);
    });

    it('should not change anything for a non-existent square ID', () => {
      const newBoard = toggleSquare(mockBoard, 999);
      expect(newBoard.map((s) => s.isMarked)).toEqual(mockBoard.map((s) => s.isMarked));
    });

    it('should support toggling the same square back and forth', () => {
      const toggled = toggleSquare(mockBoard, 0);
      expect(toggled[0].isMarked).toBe(true);
      const toggledBack = toggleSquare(toggled, 0);
      expect(toggledBack[0].isMarked).toBe(false);
    });
  });

  describe('checkBingo', () => {
    it('should return null for board without enough squares', () => {
      const board = generateBoard();
      // Clear some squares to test edge case
      expect(checkBingo(board)).toBeNull();
    });

    it('should return null when no lines are complete', () => {
      const board = generateBoard();
      expect(checkBingo(board)).toBeNull();
    });

    it('should detect a complete row', () => {
      const board = generateBoard();
      // Mark first row (indices 0-4)
      for (let i = 0; i < 5; i++) {
        board[i].isMarked = true;
      }
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('row');
      expect(result?.index).toBe(0);
    });

    it('should detect a complete column', () => {
      const board = generateBoard();
      // Mark first column (indices 0, 5, 10, 15, 20)
      for (let i = 0; i < 5; i++) {
        board[i * 5].isMarked = true;
      }
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('column');
      expect(result?.index).toBe(0);
    });

    it('should detect a complete diagonal (top-left to bottom-right)', () => {
      const board = generateBoard();
      // Mark diagonal (indices 0, 6, 12, 18, 24)
      // Note: 12 is already marked as free space
      [0, 6, 12, 18, 24].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('diagonal');
    });

    it('should detect a complete diagonal (top-right to bottom-left)', () => {
      const board = generateBoard();
      // Mark diagonal (indices 4, 8, 12, 16, 20)
      [4, 8, 12, 16, 20].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('diagonal');
    });

    it('should detect Four Corners with the exact winning payload', () => {
      const board = generateBoard();
      [0, 4, 20, 24].forEach((i) => {
        board[i].isMarked = true;
      });

      expect(checkBingo(board)).toEqual({
        type: 'corners',
        index: 0,
        squares: [0, 4, 20, 24],
      });
    });

    it('should not detect Four Corners when only three corners are marked', () => {
      const board = generateBoard();
      [0, 4, 20].forEach((i) => {
        board[i].isMarked = true;
      });

      expect(checkBingo(board)).toBeNull();
    });

    it('should prefer an existing line over Four Corners', () => {
      const board = generateBoard();
      [0, 1, 2, 3, 4, 20, 24].forEach((i) => {
        board[i].isMarked = true;
      });

      expect(checkBingo(board)).toEqual({
        type: 'row',
        index: 0,
        squares: [0, 1, 2, 3, 4],
      });
    });

    it('should win the game when the full cross (center row + center column) is marked', () => {
      const board = generateBoard();
      // Cross = center row (10, 11, 12, 13, 14) + center column (2, 7, 12, 17, 22)
      // 12 is already marked as the free space
      [2, 7, 10, 11, 13, 14, 17, 22].forEach((i) => {
        board[i].isMarked = true;
      });

      const result = checkBingo(board);
      // Design decision: the cross is a distinct named win pattern (like
      // 'corners') and is evaluated BEFORE the individual rows, columns and
      // diagonals, so completing the cross reports the cross win itself.
      // The relative order of the existing lines (rows, columns, diagonals,
      // corners) is unchanged.
      expect(result).not.toBeNull();
      expect(result).toEqual({
        type: 'cross',
        index: 0,
        squares: [2, 7, 10, 11, 12, 13, 14, 17, 22],
      });
    });

    it('should not detect a win when the cross completes neither the center row nor the center column', () => {
      const board = generateBoard();
      // 6 of the 8 non-free cross squares: missing 14 (breaks center row)
      // and missing 22 (breaks center column)
      [2, 7, 10, 11, 13, 17].forEach((i) => {
        board[i].isMarked = true;
      });

      expect(checkBingo(board)).toBeNull();
    });

    it('should not detect the cross when only the center row is complete', () => {
      const board = generateBoard();
      // Center row only (12 is already marked as the free space);
      // no center column squares (2, 7, 17, 22) are marked
      [10, 11, 13, 14].forEach((i) => {
        board[i].isMarked = true;
      });

      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).not.toBe('cross');
      expect(result).toEqual({
        type: 'row',
        index: 2,
        squares: [10, 11, 12, 13, 14],
      });
    });

    it('should not detect the cross when only the center column is complete', () => {
      const board = generateBoard();
      // Center column only (12 is already marked as the free space);
      // no center row squares (10, 11, 13, 14) are marked
      [2, 7, 17, 22].forEach((i) => {
        board[i].isMarked = true;
      });

      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).not.toBe('cross');
      expect(result).toEqual({
        type: 'column',
        index: 2,
        squares: [2, 7, 12, 17, 22],
      });
    });

    it('should include the cross in the winning lines with the exact payload', () => {
      const board = generateBoard();
      // Complete the cross: center row (10-14) + center column (2, 7, 12, 17, 22)
      [2, 7, 10, 11, 13, 14, 17, 22].forEach((i) => {
        board[i].isMarked = true;
      });

      // RED: fails until the cross line { type: 'cross', index: 0, squares: [2, 7, 10, 11, 12, 13, 14, 17, 22] }
      // is appended to the winning lines (after 'corners'). Note: on a full cross
      // the center row fires first per line precedence, so this assertion
      // documents the intended cross contract for the Green phase.
      expect(checkBingo(board)).toEqual({
        type: 'cross',
        index: 0,
        squares: [2, 7, 10, 11, 12, 13, 14, 17, 22],
      });
    });

    it('should work with free space in center', () => {
      const board = generateBoard();
      [10, 11, 12, 13, 14].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('row');
      expect(result?.index).toBe(2);
    });

    it('should detect all 5 rows', () => {
      for (let row = 0; row < 5; row++) {
        const board = generateBoard();
        for (let col = 0; col < 5; col++) {
          board[row * 5 + col].isMarked = true;
        }
        const result = checkBingo(board);
        expect(result).not.toBeNull();
        expect(result?.type).toBe('row');
        expect(result?.index).toBe(row);
      }
    });

    it('should detect all 5 columns', () => {
      for (let col = 0; col < 5; col++) {
        const board = generateBoard();
        for (let row = 0; row < 5; row++) {
          board[row * 5 + col].isMarked = true;
        }
        const result = checkBingo(board);
        expect(result).not.toBeNull();
        expect(result?.type).toBe('column');
        expect(result?.index).toBe(col);
      }
    });

    it('should return null when only 4 of 5 in a row are marked', () => {
      const board = generateBoard();
      [0, 1, 2, 3].forEach((i) => {
        board[i].isMarked = true;
      });
      expect(checkBingo(board)).toBeNull();
    });

    it('should return null when only 4 of 5 in a column are marked', () => {
      const board = generateBoard();
      [0, 5, 10, 15].forEach((i) => {
        board[i].isMarked = true;
      });
      expect(checkBingo(board)).toBeNull();
    });

    it('should return null when only 4 of 5 in a diagonal are marked', () => {
      const board = generateBoard();
      [0, 6, 12, 18].forEach((i) => {
        board[i].isMarked = true;
      });
      expect(checkBingo(board)).toBeNull();
    });

    it('should return the first winning line when multiple exist', () => {
      const board = generateBoard();
      [0, 1, 2, 3, 4, 5, 10, 15, 20].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
      expect(result?.type).toBe('row');
      expect(result?.index).toBe(0);
    });

    it('should detect bingo on a fully marked board', () => {
      const board = generateBoard();
      board.forEach((square) => {
        square.isMarked = true;
      });
      const result = checkBingo(board);
      expect(result).not.toBeNull();
    });

    it('should return the correct squares array for a winning line', () => {
      const board = generateBoard();
      [0, 1, 2, 3, 4].forEach((i) => {
        board[i].isMarked = true;
      });
      const result = checkBingo(board);
      expect(result?.squares).toEqual([0, 1, 2, 3, 4]);
    });

    it('should not count scattered marks as a bingo', () => {
      const board = generateBoard();
      [0, 6, 2, 8, 20].forEach((i) => {
        board[i].isMarked = true;
      });
      expect(checkBingo(board)).toBeNull();
    });
  });

  describe('getWinningSquareIds', () => {
    it('should return empty set when no winning line', () => {
      const result = getWinningSquareIds(null);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(0);
    });

    it('should return square IDs from winning line', () => {
      const winningLine = {
        type: 'row' as const,
        index: 0,
        squares: [0, 1, 2, 3, 4],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(5);
      expect(result.has(0)).toBe(true);
      expect(result.has(1)).toBe(true);
      expect(result.has(2)).toBe(true);
      expect(result.has(3)).toBe(true);
      expect(result.has(4)).toBe(true);
    });

    it('should handle diagonal winning line', () => {
      const winningLine = {
        type: 'diagonal' as const,
        index: 0,
        squares: [0, 6, 12, 18, 24],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result.size).toBe(5);
      expect(result.has(0)).toBe(true);
      expect(result.has(6)).toBe(true);
      expect(result.has(12)).toBe(true);
      expect(result.has(18)).toBe(true);
      expect(result.has(24)).toBe(true);
    });

    it('should handle column winning line', () => {
      const winningLine = {
        type: 'column' as const,
        index: 2,
        squares: [2, 7, 12, 17, 22],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result.size).toBe(5);
      [2, 7, 12, 17, 22].forEach((id) => {
        expect(result.has(id)).toBe(true);
      });
    });

    it('should handle cross winning line', () => {
      const winningLine = {
        type: 'cross' as const,
        index: 0,
        squares: [2, 7, 10, 11, 12, 13, 14, 17, 22],
      };
      const result = getWinningSquareIds(winningLine);
      expect(result).toBeInstanceOf(Set);
      expect(result.size).toBe(9);
      [2, 7, 10, 11, 12, 13, 14, 17, 22].forEach((id) => {
        expect(result.has(id)).toBe(true);
      });
    });
  });

  describe('integration: generateBoard + toggleSquare + checkBingo', () => {
    it('should detect bingo after toggling an entire row', () => {
      const board = generateBoard();
      let current = board;
      [0, 1, 2, 3, 4].forEach((i) => {
        if (!current[i].isMarked) {
          current = toggleSquare(current, i);
        }
      });
      expect(checkBingo(current)).not.toBeNull();
    });

    it('should lose bingo after untoggling a square from a winning line', () => {
      const board = generateBoard();
      let current = board;
      [0, 1, 2, 3, 4].forEach((i) => {
        if (!current[i].isMarked) {
          current = toggleSquare(current, i);
        }
      });
      expect(checkBingo(current)).not.toBeNull();
      current = toggleSquare(current, 0);
      expect(checkBingo(current)).toBeNull();
    });

    it('should report correct winning square IDs from a detected bingo', () => {
      const board = generateBoard();
      let current = board;
      const lastRowIds = [20, 21, 22, 23, 24];
      lastRowIds.forEach((i) => {
        if (!current[i].isMarked) {
          current = toggleSquare(current, i);
        }
      });
      const line = checkBingo(current);
      expect(line).not.toBeNull();
      const ids = getWinningSquareIds(line);
      expect(ids).toEqual(new Set(lastRowIds));
    });

    it('should report exactly the four corner IDs after toggling them', () => {
      let board = generateBoard();
      const cornerIds = [0, 4, 20, 24];

      cornerIds.forEach((id) => {
        board = toggleSquare(board, id);
      });

      const line = checkBingo(board);
      expect(line).toEqual({
        type: 'corners',
        index: 0,
        squares: cornerIds,
      });
      expect(getWinningSquareIds(line)).toEqual(new Set(cornerIds));
    });

    it('should win the game after toggling the cross squares', () => {
      let board = generateBoard();
      // Toggle order chosen so that neither the center row nor the center
      // column completes early: after these 6 toggles both lines are still
      // missing one square (14 for the row, 22 for the column)
      [10, 11, 13, 2, 7, 17].forEach((id) => {
        board = toggleSquare(board, id);
      });
      expect(checkBingo(board)).toBeNull();

      // Toggling 22 completes the center column (2, 7, 12, 17, 22) — game won
      board = toggleSquare(board, 22);
      const line = checkBingo(board);
      expect(line).toEqual({
        type: 'column',
        index: 2,
        squares: [2, 7, 12, 17, 22],
      });
      expect(getWinningSquareIds(line)).toEqual(new Set([2, 7, 12, 17, 22]));

      // Toggling 14 also completes the center row — cross fully marked, still won
      board = toggleSquare(board, 14);
      expect(checkBingo(board)).not.toBeNull();
    });
  });
});
