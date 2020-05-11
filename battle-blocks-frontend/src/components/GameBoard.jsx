import React, { useState, useEffect } from "react";
import Block from "../components/Block";
import EmptyBlock from "./EmptyBlock";

function getBlockAreaPosition(power) {
  let row = 0;
  let col = 0;
  if (power > 5) {
    row = 1;
    power -= 5;
  }
  col = power - 1;

  return { x: col, y: row };
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

function GameBoard(props) {
  const { yourBlocks, theirBlocks } = props;
  // const [currentGame, setCurrentGame] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const boardArray = [[], [], [], [], []];

  useEffect(() => {
    initializeBoard();
  }, []);

  function initializeBoard() {
    yourBlocks.forEach((block) => {
      if (block.position && block.power > 0)
        boardArray[block.position.y][block.position.x] = block;
    });
    theirBlocks.forEach((block) => {
      if (block.position && block.power > 0)
        boardArray[block.position.y][block.position.x] = block;
    });

    // for (var i = 0; i < 5; i++){
    //     for (var j = 0; j < 5; j++){
    //         if (!boardArray[i][j])
    //         boardArray[i][j]
    //     }
    // }
  }

  function selectBlock(newBlockId) {
    if (selectedBlock && selectedBlock.id === newBlockId)
      setSelectedBlock(null);
    else setSelectedBlock(yourBlocks.find((block) => block.id === newBlockId));
  }

  function placeBlock(x, y) {
    if (boardArray[y][x] && !selectedBlock) return;

    boardArray[y][x] = selectedBlock;
    selectedBlock.position = { x, y };

    setSelectedBlock(null);
  }

  return (
    <React.Fragment>
      <div className="game-area">{renderGameArea()}</div>
      <div className="block-area">
        {/* <h3>Your Blocks</h3> */}
        {renderBlockArea()}
      </div>
    </React.Fragment>
  );

  function renderGameArea() {
    const elements = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (!boardArray[i][j])
          elements.push(<EmptyBlock y={i} x={j} handleClick={placeBlock} />);
      }
    }

    yourBlocks.forEach((block) => {
      if (block.position && block.power > 0)
        elements.push(
          <Block
            key={block.id}
            id={block.id}
            position={block.position}
            power={block.power}
            directions={block.directions}
            owner="yours"
          />
        );
    });
    theirBlocks.forEach((block) => {
      if (block.position && block.power > 0)
        elements.push(
          <Block
            key={block.id}
            id={block.id}
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
            key={i + " " + j}
            className="tile"
            style={{
              gridArea:
                "" +
                (i + 1) +
                " / " +
                (j + 1) +
                " / " +
                (i + 2) +
                " / " +
                (j + 2),
            }}
          ></div>
        );
      }
    }
    yourBlocks.forEach((block) => {
      if (!block.position && block.power > 0)
        elements.push(
          <Block
            key={block.id}
            id={block.id}
            position={getBlockAreaPosition(block.power)}
            power={block.power}
            directions={block.directions}
            owner="yours"
            handleClick={selectBlock}
            isSelected={selectedBlock && block.id === selectedBlock.id}
          />
        );
    });
    return elements;
  }
}

export default GameBoard;

//  style={{ gridArea:"" + (i + 1) + " / " + (j + 1) + " / " + (i + 2) + " / " + (j + 2)}}