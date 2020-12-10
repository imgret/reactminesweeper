import { useState } from 'react';
import Board from './Board.js';

function Game() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [bombs, setBombs] = useState(1);
  const [cells, setCells] = useState([[]]);
  const [gameResult, setGameResult] = useState('in process');

  const handleSettingsInput = (value, setter) => {
    let parsedValue = Number.parseInt(value);
    if (!Number.isNaN(parsedValue) && parsedValue > 0) setter(parsedValue);
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

  const handleStartButton = () => {
    setGameResult('in process');

    let newCells = generateEmptyCells();
    newCells = populateCells(newCells);
    setCells(newCells);
  };

  const recursivelyOpenAdjacentCells = (cells, row, col) => {
    const cell = cells[row][col];
    if (cell.value === 0) {
      for (let r = -1; r <= 1; r++) {
        if (row + r < 0 || row + r >= rows) continue;
        for (let c = -1; c <= 1; c++) {
          if (col + c < 0 || col + c >= cols) continue;
          const adjacentCell = cells[row + r][col + c];
          if (adjacentCell.isHidden === false) continue;
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
      .reduce((accumulator, cell) => accumulator + cell.isHidden);
  };

  const handleCellClick = (row, col) => {
    if (gameResult === 'in process') {
      let newCells = JSON.parse(JSON.stringify(cells));
      const cell = newCells[row][col];
      cell.isHidden = false;

      const isWin = countOpenedCells(newCells) === rows * cols - bombs;
      const isLoss = cell.value === 'B';

      if (isLoss) {
        setGameResult('loss');
        newCells = openBombs(newCells);
      } else if (isWin) {
        setGameResult('win');
      } else {
        newCells = recursivelyOpenAdjacentCells(newCells, row, col);
      }

      setCells(newCells);
    }
  };

  return (
    <div>
      <label>
        Rows:{' '}
        <input
          value={rows}
          onChange={(e) => handleSettingsInput(e.target.value, setRows)}
        />
      </label>
      <label>
        Columns:{' '}
        <input
          value={cols}
          onChange={(e) => handleSettingsInput(e.target.value, setCols)}
        />
      </label>
      <label>
        Bombs:{' '}
        <input
          value={bombs}
          onChange={(e) => handleSettingsInput(e.target.value, setBombs)}
        />
      </label>
      <button onClick={handleStartButton}>Start</button>
      {gameResult ? <h3>Game over</h3> : null}
      <Board cells={cells} onCellClick={handleCellClick}></Board>
    </div>
  );
}

export default Game;
