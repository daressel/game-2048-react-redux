import { useState, useMemo, KeyboardEvent } from 'react';
import { IPlayground, IPlaygroundProps, Position, IBlock } from '../../types';
import { initPlayground, initMap } from '../../utils';

export const Playground = ({ size = 4 }: IPlaygroundProps) => {
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
  const [block, setBlock] = useState(false);

  const move = async (direction: number, axis: 'row' | 'col') => {
    const stepChange = direction ? -1 : 1;
    const copyPlayground = JSON.parse(JSON.stringify(playground)) as IPlayground;
    const axisOpt = {
      line: axis === 'row' ? 'top' : 'left',
      block: axis === 'row' ? 'left' : 'top',
    } as {
      line: 'top' | 'left';
      block: 'top' | 'left';
    };

    const condition = (index: number): boolean => {
      return index < size && index >= 0;
    };

    for (let line = 0; condition(line); line++) {
      const lineBlocks = copyPlayground.filter((block) => block.position[axisOpt.line] === line);
      if (!lineBlocks.length) continue;

      let blockIndex = direction ? size - 1 : 0;
      while (condition(blockIndex)) {
        let trackIndex = blockIndex;
        let blocks: IBlock[] = [];
        while (condition(trackIndex) && blocks.length < 2) {
          const block = lineBlocks.find(
            (el) => el.position[axisOpt.block] === trackIndex && el.position[axisOpt.line] === line
          );
          if (block) {
            if (!blocks.length || block.value === blocks[0].value) {
              block.position[axisOpt.block] = blockIndex;
            }
            blocks.push(block);
          }

          trackIndex += stepChange;
        }

        blockIndex += stepChange;
      }
    }

    setPlayground(copyPlayground);
  };

  const handle = async ({ key }: KeyboardEvent<HTMLDivElement>) => {
    const keyHandlers = {
      d: async () => move(1, 'row'),
      D: async () => move(1, 'row'),
      ArrowRight: async () => move(1, 'row'),

      a: async () => move(0, 'row'),
      A: async () => move(0, 'row'),
      ArrowLeft: async () => move(0, 'row'),

      w: async () => move(0, 'col'),
      W: async () => move(0, 'col'),
      ArrowUp: async () => move(0, 'col'),

      s: async () => move(1, 'col'),
      S: async () => move(1, 'col'),
      ArrowDown: async () => move(1, 'col'),
    };
    setBlock(true);
    await keyHandlers[key as keyof typeof keyHandlers]();
    setBlock(false);
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
