function Cell(props) {
  const { cell, onClick, onContextMenu } = props;

  const renderCellContent = (cell) => {
    let content;
    if (cell.isHidden && cell.isFlagged) {
      content = '🚩';
    } else if (!cell.isHidden && cell.value !== 0) {
      content = cell.value;
    } else {
      content = null;
    }
    return content;
  };

  const chooseCellColor = (cell) => {
    let color;
    if (cell.isHidden) {
      color = 'lightgrey';
    } else if (!cell.isHidden && cell.value === 'B') {
      color = 'darkred';
    } else {
      color = 'grey';
    }
    return color;
  };

  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: chooseCellColor(cell),
        border: 'none',
        lineHeight: '30px',
        textAlign: 'center',
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      {renderCellContent(cell)}
    </div>
  );
}

export default Cell;
