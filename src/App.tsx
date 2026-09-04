import { useBingoGame } from './hooks/useBingoGame';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { BingoModal } from './components/BingoModal';
import { ThemeSelector } from './components/ThemeSelector';
import { useTheme } from './hooks/useTheme';

function App() {
  const { themeMode, setThemeMode } = useTheme();
  const {
    gameState,
    board,
    winningSquareIds,
    showBingoModal,
    startGame,
    handleSquareClick,
    resetGame,
    dismissModal,
  } = useBingoGame();
  const themeSelector = (
    <ThemeSelector value={themeMode} onChange={setThemeMode} />
  );

  if (gameState === 'start') {
    return <StartScreen onStart={startGame} themeSelector={themeSelector} />;
  }

  return (
    <>
      <GameScreen
        board={board}
        winningSquareIds={winningSquareIds}
        hasBingo={gameState === 'bingo'}
        onSquareClick={handleSquareClick}
        onReset={resetGame}
        themeSelector={themeSelector}
      />
      {showBingoModal && (
        <BingoModal onDismiss={dismissModal} />
      )}
    </>
  );
}

export default App;
