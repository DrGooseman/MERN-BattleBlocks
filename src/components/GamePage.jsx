import React from "react";
import Block from "./Block";

const yourBlocks = [
  {
    power: 2,
    position: null,
    directions: [true, false, true, false, true, false, true, false]
  },
  {
    power: 4,
    position: [0, 1],
    directions: [false, true, false, false, false, true, false, true]
  }
];
const theirBlocks = [
  {
    power: 2,
    position: [1, 2],
    directions: [true, false, true, false, true, false, true, false]
  },
  {
    power: 4,
    position: null,
    directions: [false, true, false, false, false, true, false, true]
  }
];

function renderGameArea() {
  const elements = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      elements.push(
        <div
          className="tile"
          style={{
            gridArea:
              "" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)
          }}
        ></div>
      );
    }
  }

  yourBlocks.forEach(block => {
    if (block.position && block.power > 0)
      elements.push(
        <Block
          position={block.position}
          power={block.power}
          directions={block.directions}
        />
      );
  });
  theirBlocks.forEach(block => {
    if (block.position && block.power > 0)
      elements.push(
        <Block
          position={block.position}
          power={block.power}
          directions={block.directions}
        />
      );
  });
  return elements;
}

function renderBlockArea() {
  const elements = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 5; j++) {
      elements.push(
        <div
          className="tile"
          style={{
            gridArea:
              "" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)
          }}
        ></div>
      );
    }
  }
  return elements;
}

function mapBlocks() {
  const elements = [];
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      elements.push(<div className="tile"></div>);
    }
  }
  return elements;
}

function GamePage() {
  return (
    <div className="container2 grid-container">
      <div className="side-area">
        <h1>SideArea</h1>
      </div>
      <div className="game-area">{renderGameArea()}</div>
      <div className="block-area">
        {/* <h3>Your Blocks</h3> */}
        {renderBlockArea()}
      </div>
    </div>
  );
}

export default GamePage;

//  style={{ gridArea:"" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)}}
