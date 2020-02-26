import React from "react";

function Block(props) {
  return (
    <div
      className="block"
      style={{
        gridArea:
          "" +
          (props.position[0] + 1) +
          " / " +
          (props.position[1] + 1) +
          " / " +
          (props.position[0] + 2) +
          " / " +
          (props.position[1] + 2)
      }}
    >
      {props.power}
    </div>
  );
}

export default Block;
