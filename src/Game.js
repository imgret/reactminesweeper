import { useState } from 'react';
import Board from './Board.js';

function Game() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [bombs, setBombs] = useState(1);
  const [cells, setCells] = useState([[]]);
  const [hiddenCells, setHiddenCells] = useState([[]]);

  const handleSettingsInput = (value, setter) => {
    let parsedValue = Number.parseInt(value);
    if (!Number.isNaN(parsedValue) && parsedValue > 0) setter(parsedValue);
  };

  const generateEmptyCells = (value) => {
    const cells = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(value));
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
        if (cells[row + r][col + c] === 'B') continue;
        cells[row + r][col + c] += 1;
      }
    }
  };

  const populateCells = (cells) => {
    let placedBombs = 0;
    while (placedBombs < bombs) {
      const row = getRandomInt(rows);
      const col = getRandomInt(cols);
      if (cells[row][col] !== 'B') {
        placedBombs++;
        cells[row][col] = 'B';
        incrementAdjacentCellsByOne(cells, row, col);
      }
    }
    return cells;
  };

  const handleStartButton = () => {
    let cells = generateEmptyCells(0);
    cells = populateCells(cells);
    setCells(cells);

    const hiddenCells = generateEmptyCells(true);
    setHiddenCells(hiddenCells);
  };

  const recursivelyOpenAdjacentCells = (hiddenCells, row, col) => {
    if (cells[row][col] === 0) {
      for (let r = -1; r <= 1; r++) {
        if (row + r < 0 || row + r >= rows) continue;
        for (let c = -1; c <= 1; c++) {
          if (col + c < 0 || col + c >= cols) continue;
          if (hiddenCells[row + r][col + c] === false) continue;
          hiddenCells[row + r][col + c] = false;
          recursivelyOpenAdjacentCells(hiddenCells, row + r, col + c);
        }
      }
    } else if (cells[row][col] !== 'B') {
      hiddenCells[row][col] = false;
    }
    return hiddenCells;
  };

  const openConnectedHiddenCells = (row, col) => {
    let newHiddenCells = JSON.parse(JSON.stringify(hiddenCells));
    newHiddenCells = recursivelyOpenAdjacentCells(newHiddenCells, row, col);
    setHiddenCells(newHiddenCells);
  };

  const handleCellClick = (row, col) => {
    const newHiddenCells = JSON.parse(JSON.stringify(hiddenCells));
    newHiddenCells[row][col] = false;
    setHiddenCells(newHiddenCells);

    if (cells[row][col] === 'B') {
      console.log('Game over');
    } else {
      openConnectedHiddenCells(row, col);
    }
    // TODO: check win or loose
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
      <Board
        cells={cells}
        hiddenCells={hiddenCells}
        onCellClick={handleCellClick}
      ></Board>
    </div>
  );
}

export default Game;
