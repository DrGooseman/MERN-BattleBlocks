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
  },
  {
    power: 5,
    position: null,
    directions: [true, false, true, false, true, false, true, false]
  },
  {
    power: 6,
    position: null,
    directions: [true, false, true, false, true, false, true, false]
  },
  {
    power: 9,
    position: null,
    directions: [false, false, false, true, false, false, true, false]
  },
  {
    power: 10,
    position: null,
    directions: [false, false, true, false, false, false, false, false]
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
          owner="yours"
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
          owner="theirs"
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
  yourBlocks.forEach(block => {
    if (!block.position && block.power > 0)
      elements.push(
        <Block
          position={getBlockAreaPosition(block.power)}
          power={block.power}
          directions={block.directions}
          owner="yours"
        />
      );
  });
  return elements;
}

function getBlockAreaPosition(power) {
  let row = 0;
  let col = 0;
  if (power > 5) {
    row = 1;
    power -= 5;
  }
  col = power - 1;
  console.log([row, col]);
  return [row, col];
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
