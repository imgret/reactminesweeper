import Cell from './Cell.js';

function Board(props) {
  const cells = props.cells;
  const renderedCells = cells.map((row, rowIndex) => {
    return (
      <tr key={rowIndex}>
        {row.map((col, colIndex) => (
          <td key={colIndex}>
            <Cell
              row={rowIndex}
              col={colIndex}
              content={col.value}
              isHidden={cells[rowIndex][colIndex].isHidden}
              onClick={props.onCellClick}
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
