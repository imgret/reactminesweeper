import Cell from './Cell.js';

function Board(props) {
  const cells = props.cells;
  const renderedCells = cells.map((row, rowIndex) => {
    return (
      <tr key={rowIndex}>
        {row.map((col, colIndex) => (
          <td key={colIndex}>
            <Cell
              cell={col}
              onClick={() => props.onCellClick(rowIndex, colIndex)}
            />
          </td>
        ))}
      </tr>
    );
  });

  return (
    <table>
      <tbody>{renderedCells}</tbody>
    </table>
  );
}

export default Board;
