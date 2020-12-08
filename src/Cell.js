function Cell(props) {
  const { row, col, content, isHidden, onClick } = props;
  const handleClick = () => {
    onClick(row, col);
  };
  return (
    <div
      style={{
        width: '30px',
        height: '30px',
        backgroundColor: isHidden ? 'lightgray' : content === 'B' ? 'darkred' : 'grey',
        border: 'none',
        lineHeight: '30px',
        textAlign: 'center',
      }}
      onClick={() => handleClick()}
    >
      {isHidden ? 'H' : content !== 0 ? content : ''}
    </div>
  );
}

export default Cell;
