import { useState, useEffect, useMemo, KeyboardEvent } from 'react';
import { IBlock, IPlayground, IPlaygroundProps } from '../../types';
import { getRandomBlocksOnStart, initPlayground, getNewRandomBlock } from '../../utils';

export const Playground = ({ size = 8 }: IPlaygroundProps) => {
  const [playground, setPlayground] = useState(initPlayground(size));
  const diff = 100 / size;

  const verticalMove = (direction: number) => {};

  const horizontalAnimation = async (direction: number) => {
    const updatedPlayground = [...playground];
    const updatedValues = JSON.parse(JSON.stringify(playground)) as IPlayground;

    const stepDiff = direction ? -1 : 1;
    let i = direction ? size - 1 : 0;
    let j = 0;
    let k = 0;

    const condition = (value: number) => {
      return value < size && value >= 0;
    };

    for (i; condition(i); i += stepDiff) {
      const rowValues = updatedValues[i];
      const row = updatedPlayground[i];

      j = direction ? row.length - 1 : 0;
      for (j; condition(j); j = j + stepDiff) {
        if (!row[j].value) {
          continue;
        }
        if (i === 1) {
          k = -stepDiff;
          while (condition(j + k)) {
            const potentialBlockPos = `${(j + k) * diff}%`;
            const currentBlockPos = `${j * diff}%`;
            console.log(potentialBlockPos, currentBlockPos);
            k -= stepDiff;
          }

          console.log('blockpos', j, ' result -> ', j + k);
        }

        // k = -stepDiff;
        // while (condition(j + k)) {
        //   if (!row[j + k].value && condition(j + k - stepDiff)) {
        //     console.log(condition(j + k + stepDiff));
        //     k -= stepDiff;

        //     continue;
        //   }

        //   if (
        //     row.filter(
        //       (block) =>
        //         block.value === row[j].value && block.position.left === row[j + k].position.left
        //     ).length < 2
        //   ) {
        //     row[j].position.left = row[j + k].position.left;
        //   }
        //   k -= stepDiff;
        // }
      }

      j = direction ? size - 1 : 0;
      for (j; condition(j); j = j + stepDiff) {
        if (!rowValues[j].value) continue;

        k = stepDiff;
        while (condition(j + k) && !rowValues[j + k].value) {
          k += stepDiff;
        }

        if (rowValues[j + k]?.value === rowValues[j].value) {
          rowValues[j].value = rowValues[j].value << 1;
          rowValues[j + k].value = 0;
          j += k;
        }
      }
    }
    setPlayground(updatedPlayground);

    await new Promise((res) => {
      setTimeout(() => {
        res(true);
      }, 800);
    });
    // getNewRandomBlock(updatedValues, size);
    setPlayground(updatedValues);
  };

  const horizontalMove = async (direction: number) => {
    const updatedPlayground = [...playground];
    await horizontalAnimation(direction);

    const stepDiff = direction ? -1 : 1;
    updatedPlayground.forEach((row, rowIndex) => {
      let i = direction ? row.length - 1 : 0;
      let k = i - stepDiff;
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
                    <div key={`block-${blockIndex}`} className="block-container">
                      <>
                        {blockData.value ? (
                          <div
                            className="active-block"
                            style={{
                              top: blockData.position.top,
                              left: blockData.position.left,
                            }}
                          >
                            {blockData.value}
                          </div>
                        ) : null}
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
