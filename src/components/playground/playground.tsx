import { useState, useEffect, useMemo, KeyboardEvent } from 'react';
import { IBlock, IPlayground, IPlaygroundProps, Position } from '../../types';
import { initPlayground, initMap } from '../../utils';

export const Playground = ({ size = 10 }: IPlaygroundProps) => {
  const map = useMemo(() => {
    const map: Position[] = initMap(size, size);
    return map;
  }, [size]);

  const diff = useMemo(() => {
    return 100 / size;
  }, [size]);

  const mapRender = useMemo(() => {
    return map.map((el, index) => {
      return (
        <div
          key={`empty-block-${index}`}
          className="block-container"
          style={{
            top: `${diff * el.top}%`,
            left: `${diff * el.left}%`,
          }}
        ></div>
      );
    });
  }, [size]);

  const playgroundStyle = useMemo(() => {
    return { height: `${size * 50 + size * 10}px`, width: `${size * 50 + size * 10}px` };
  }, [size]);

  const [playground, setPlayground] = useState(initPlayground(map));

  const verticalMove = async (direction: number) => {};

  const horizontalMove = async (direction: number) => {
    const stepChange = direction ? -1 : 1;
    const copyPlayground = JSON.parse(JSON.stringify(playground)) as IPlayground;

    const condition = (index: number): boolean => {
      return index < size && index >= 0;
    };

    for (let line = 0; condition(line); line++) {
      const lineBlocks = copyPlayground.filter((block) => block.position.top === line);
      if (!lineBlocks.length) continue;

      let blockIndex = direction ? size - 1 : 0;
      while (condition(blockIndex)) {
        let trackIndex = blockIndex;
        let blockLength = 0;
        while (condition(trackIndex) && blockLength < 2) {
          const block = lineBlocks.find(
            (el) => el.position.left === trackIndex && el.position.top === line
          );
          if (block) {
            block.position.left = blockIndex;
            blockLength++;
          }
          trackIndex += stepChange;
        }

        blockIndex += stepChange;
      }
    }

    setPlayground(copyPlayground);
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
        <div className="playground-container" style={playgroundStyle}>
          <>
            {mapRender}
            {playground.map((block, blockIndex) => {
              const positionStyle = {
                top: `${diff * block.position.top}%`,
                left: `${diff * block.position.left}%`,
              };
              return (
                <div
                  key={`active-block-${blockIndex}`}
                  className="active-block"
                  style={positionStyle}
                >
                  {block.value}
                </div>
              );
            })}
          </>
        </div>
      </div>
    </>
  );
};
