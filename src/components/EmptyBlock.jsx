import React from "react";

function EmptyBlock(props) {
  const { y, x, handleClick } = props;
  return (
    <div
      key={y + " " + x}
      className="tile"
      onClick={() => handleClick(x, y)}
      style={{
        gridArea:
          "" + (y + 1) + " / " + (x + 1) + " / " + (y + 2) + " / " + (x + 2),
      }}
    ></div>
  );
}

export default EmptyBlock;
