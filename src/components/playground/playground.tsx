import { useState, useEffect, useMemo, KeyboardEvent } from "react";
import { IBlock, IPlayground, IPlaygroundProps } from "../../types";
import {
  getRandomBlocksOnStart,
  initPlayground,
  getNewRandomBlock,
} from "../../utils";

export const Playground = ({ size = 4 }: IPlaygroundProps) => {
  const [playground, setPlayground] = useState(initPlayground(size));

  const verticalMove = (direction: number) => {};

  const horizontalAnimation = async (direction: number) => {
    const updatedPlayground = [...playground];
    const updatedValues = JSON.parse(JSON.stringify(playground)) as IBlock[][];
    const stepDiff = direction ? -1 : 1;
    updatedPlayground.forEach((row, rowIndex) => {
      let i = direction ? row.length - 1 : 0;
      let j = i - stepDiff;

      const condition = (value: number) => {
        const result = value < row.length && value >= 0;
        return result;
      };

      const jCondition = (jValue: number) => {
        const condition =
          row.filter(
            (el) =>
              el.value === row[jValue].value &&
              el.position.top === row[jValue]?.position.top &&
              el.position.left === row[jValue]?.position.left
          ).length < 2;

        return condition;
      };

      const rowValues = updatedValues[rowIndex];
      while (condition(i)) {
        const currentBlock = rowValues[i];
        if (!row[i].value) {
          i = i + stepDiff;
          j = i - stepDiff;
          continue;
        }
        while (condition(j) && jCondition(j)) {
          j = j - stepDiff;
        }
        row[i].position = row[j + stepDiff].position;

        j = i - stepDiff;
        while (condition(j)) {
          console.log(123123);
          if (currentBlock.value === rowValues[j].value) {
            rowValues[j].value = currentBlock.value ** 2;
            currentBlock.value = 0;
          }
          j = i - stepDiff;
        }
        i = i + stepDiff;
        j = i - stepDiff;
      }
    });
    setPlayground(updatedPlayground);

    await new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 200);
    });

    setPlayground(updatedValues);
  };

  const horizontalMove = async (direction: number) => {
    const updatedPlayground = [...playground];
    await horizontalAnimation(direction);

    const stepDiff = direction ? -1 : 1;
    updatedPlayground.forEach((row, rowIndex) => {
      let i = direction ? row.length - 1 : 0;
      let j = i - stepDiff;
    });
  };

  const handle = ({ key }: KeyboardEvent<HTMLDivElement>) => {
    const keyHandlers = {
      d: () => horizontalMove(1),
      D: () => horizontalMove(1),
      ArrowRight: () => horizontalMove(1),

      a: () => horizontalMove(0),
      A: () => horizontalMove(0),
      ArrowLeft: () => horizontalMove(0),

      w: () => verticalMove(1),
      W: () => verticalMove(1),
      ArrowUp: () => verticalMove(1),

      s: () => verticalMove(0),
      S: () => verticalMove(0),
      ArrowDown: () => verticalMove(0),
    };

    keyHandlers[key as keyof typeof keyHandlers]();
  };

  return (
    <>
      <div className="playground-wrapper" onKeyDown={handle} tabIndex={0}>
        <div className="playground-container">
          {playground.map((row, rowIndex) => {
            return (
              <div key={`row-${rowIndex}`} className="row-container">
                {row.map((blockData, blockIndex: number) => {
                  return (
                    <div
                      key={`block-${blockIndex}`}
                      className="block-container"
                    >
                      <>
                        {blockData.value && (
                          <div
                            className="active-block"
                            style={{
                              top: blockData.position.top,
                              left: blockData.position.left,
                            }}
                          >
                            {blockData.value}
                          </div>
                        )}
                      </>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
