import Cell from './Cell.js';

function Board(props) {
  const {cells, onClick, onContextMenu} = props;

  const renderedCells = cells.map((row, rowIndex) => {
    return (
      <tr key={rowIndex}>
        {row.map((col, colIndex) => (
          <td key={colIndex}>
            <Cell
              cell={col}
              onClick={onClick(rowIndex, colIndex)}
              onContextMenu={onContextMenu(rowIndex, colIndex)}
            />
          </td>
        ))}
      </tr>
    );
  });

  const handleContextMenu = (e) => e.preventDefault();

  return (
    <table onContextMenu={handleContextMenu}>
      <tbody>{renderedCells}</tbody>
    </table>
  );
}

export default Board;
