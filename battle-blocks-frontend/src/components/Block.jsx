import React from "react";

function Block(props) {
  const x = props.position.x;
  const y = props.position.y;

  return (
    <div
      className={"block " + props.owner + (props.isSelected ? " selected" : "")}
      onClick={() => props.handleClick(props.id)}
      style={{
        gridArea:
          "" + (y + 1) + " / " + (x + 1) + " / " + (y + 2) + " / " + (x + 2),
      }}
    >
      {props.directions[0] && (
        <div className="block-direction" style={{ gridArea: "1 / 1 / 2 / 2" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[1] && (
        <div className="block-direction" style={{ gridArea: "1 / 2 / 2 / 3" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[2] && (
        <div className="block-direction" style={{ gridArea: "1 / 3 / 2 / 4" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[3] && (
        <div className="block-direction" style={{ gridArea: "2 / 1 / 3 / 2" }}>
          <h3>*</h3>
        </div>
      )}
      <div className="" style={{ gridArea: "2 / 2 / 3 / 3" }}>
        <h2>{props.power}</h2>
      </div>
      {props.directions[4] && (
        <div className="block-direction" style={{ gridArea: "2 / 3 / 3 / 4" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[5] && (
        <div className="block-direction" style={{ gridArea: "3 / 1 / 4 / 2" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[6] && (
        <div className="block-direction" style={{ gridArea: "3 / 2 / 4 / 3" }}>
          <h3>*</h3>
        </div>
      )}
      {props.directions[7] && (
        <div className="block-direction" style={{ gridArea: "3 / 3 / 4 / 4" }}>
          <h3>*</h3>
        </div>
      )}
    </div>
  );
}

export default Block;
