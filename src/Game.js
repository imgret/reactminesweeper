import { useState } from 'react';
import Board from './Board.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import GameSettingsForm from './GameSettingsForm.js';

function Game() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [bombs, setBombs] = useState(1);
  const [cells, setCells] = useState([[]]);
  const [gameStatus, setGameStatus] = useState({
    status: 'in process',
    message: '',
  });

  const handleSettingsInput = (setter) => (e) => {
    let value = Number.parseInt(e.target.value);
    if (Number.isInteger(value) && value > 0) setter(value);
  };

  const createCell = (value = 0, isHidden = true, isFlagged = false) => {
    return { value: value, isHidden: isHidden, isFlagged: isFlagged };
  };

  const generateEmptyCells = () => {
    const cells = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => createCell())
      );
    return cells;
  };

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const incrementAdjacentCellsByOne = (cells, row, col) => {
    for (let r = -1; r <= 1; r++) {
      if (row + r < 0 || row + r >= rows) continue;
      for (let c = -1; c <= 1; c++) {
        if (col + c < 0 || col + c >= cols) continue;
        const cell = cells[row + r][col + c];
        if (cell.value === 'B') continue;
        cell.value += 1;
      }
    }
  };

  const populateCells = (cells) => {
    let placedBombs = 0;
    while (placedBombs < bombs) {
      const row = getRandomInt(rows);
      const col = getRandomInt(cols);
      const cell = cells[row][col];
      if (cell.value !== 'B') {
        placedBombs++;
        cell.value = 'B';
        incrementAdjacentCellsByOne(cells, row, col);
      }
    }
    return cells;
  };

  const resetGame = () => {
    let newCells = [[]];
    if (JSON.stringify(cells) !== JSON.stringify(newCells)) {
      setGameStatus({ status: 'in process', message: '' });
      setCells(newCells);
    }
  };

  const startNewGame = () => {
    setGameStatus({ status: 'in process', message: '' });

    let newCells = generateEmptyCells();
    newCells = populateCells(newCells);
    setCells(newCells);
  };

  const handleStartButton = () => {
    if (bombs > rows * cols) {
      const status = {
        status: 'error',
        message: "Bombs number shouldn't exceed number of board's cells",
      };
      resetGame();
      setGameStatus(status);
    } else {
      startNewGame();
    }
  };

  const recursivelyOpenAdjacentCells = (cells, row, col) => {
    const cell = cells[row][col];
    if (cell.value === 0) {
      for (let r = -1; r <= 1; r++) {
        if (row + r < 0 || row + r >= rows) continue;
        for (let c = -1; c <= 1; c++) {
          if (col + c < 0 || col + c >= cols) continue;
          const adjacentCell = cells[row + r][col + c];
          if (!adjacentCell.isHidden) continue;
          adjacentCell.isHidden = false;
          recursivelyOpenAdjacentCells(cells, row + r, col + c);
        }
      }
    } else if (cell !== 'B') {
      cell.isHidden = false;
    }
    return cells;
  };

  const openBombs = (cells) => {
    for (let r = 0; r < cells.length; r++) {
      for (let c = 0; c < cells[r].length; c++) {
        const cell = cells[r][c];
        if (cell.value === 'B') cell.isHidden = false;
      }
    }
    return cells;
  };

  const countOpenedCells = (cells) => {
    return cells
      .flat()
      .reduce((accumulator, cell) => accumulator + !cell.isHidden, 0);
  };

  const handleCellLeftClick = (row, col) => (e) => {
    if (gameStatus.status === 'in process') {
      let newCells = JSON.parse(JSON.stringify(cells));
      newCells = recursivelyOpenAdjacentCells(newCells, row, col);
      const cell = newCells[row][col];

      const isWin = countOpenedCells(newCells) === rows * cols - bombs;
      const isLoss = cell.value === 'B';

      if (isLoss) {
        setGameStatus({ status: 'loss', message: 'You lose' });
        newCells = openBombs(newCells);
      }
      if (isWin) {
        setGameStatus({ status: 'win', message: 'You win' });
      }

      setCells(newCells);
    }
  };

  const handleCellRightClick = (row, col) => (e) => {
    if (gameStatus.status === 'in process') {
      if (cells[row][col].isHidden) {
        let newCells = JSON.parse(JSON.stringify(cells));
        const cell = newCells[row][col];
        cell.isFlagged = !cell.isFlagged;

        setCells(newCells);
      }
    }
  };

  const renderGameStatus = () => {
    const variant = gameStatus.status === 'error' ? 'danger' : 'primary';
    const element = (
      <Alert variant={variant} className='text-center'>
        {gameStatus.message}
      </Alert>
    );
    return gameStatus.message === '' ? null : element;
  };

  return (
    <div className='mt-3 mx-4 mx-sm-0'>
      <Container>
        <Row className='justify-content-center'>
          <GameSettingsForm
            values={{ rows, cols, bombs }}
            events={{
              rowsChange: handleSettingsInput(setRows),
              colsChange: handleSettingsInput(setCols),
              bombsChange: handleSettingsInput(setBombs),
              startClick: handleStartButton,
            }}
            message={renderGameStatus()}
          />
        </Row>
        <Row className='justify-content-center'>
          <Board
            cells={cells}
            onClick={handleCellLeftClick}
            onContextMenu={handleCellRightClick}
          />
        </Row>
      </Container>
    </div>
  );
}

export default Game;
