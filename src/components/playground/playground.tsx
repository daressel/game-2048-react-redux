import { useState, useMemo, KeyboardEvent } from 'react';
import { IPlayground, IPlaygroundProps, Position, IBlock, IAxisOpt } from '../../types';
import { initPlayground, initMap, addBlocks } from '../../utils';

export const Playground = ({ size = 4 }: IPlaygroundProps) => {
  const [map, diff, playgroundStyle] = useMemo(() => {
    const map: Position[] = initMap(size, size);
    const diff = 100 / size;
    const playgroundStyle = {
      height: `${size * 60}px`,
      width: `${size * 60}px`,
    };
    return [map, diff, playgroundStyle];
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

  const [playground, setPlayground] = useState(initPlayground(map));
  const [blocked, setBlocked] = useState(false);

  const condition = (index: number): boolean => {
    return index < size && index >= 0;
  };

  const move = async (direction: number, axis: 'row' | 'col') => {
    const copyPlayground = JSON.parse(JSON.stringify(playground)) as IPlayground;

    const stepChange = direction ? -1 : 1;
    const axisOpt: IAxisOpt = {
      line: axis === 'row' ? 'top' : 'left',
      block: axis === 'row' ? 'left' : 'top',
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
          if (block?.value) {
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
    setPlayground(copyPlayground.map((block) => ({ ...block, withAnimation: true })));

    await new Promise((res) => {
      setTimeout(() => res(true), 200);
    });

    copyPlayground.forEach((copyEl) => {
      const [first, second] = copyPlayground.filter(
        (el) => el.position.left === copyEl.position.left && el.position.top === copyEl.position.top
      );
      if (first && second) {
        first.value = first.value + second.value;
        second.value = 0;
      }
    });

    const blocked = (): boolean => {
      const updated = copyPlayground.reduce(
        (acc, el) => acc + el.position.left + el.position.top + el.value,
        0
      );
      const old = playground.reduce(
        (acc, el) => acc + el.position.left + el.position.top + el.value,
        0
      );
      return updated === old;
    };
    if (blocked() && copyPlayground.length === size * size) {
      setBlocked(true);
      return;
    }

    !blocked() && addBlocks({ playground: copyPlayground, count: 1, map });
    setPlayground(
      copyPlayground.filter((el) => el?.value).map((block) => ({ ...block, withAnimation: false }))
    );
  };

  const handle = async ({ key }: KeyboardEvent<HTMLDivElement>) => {
    if (blocked) return;
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
    keyHandlers[key as keyof typeof keyHandlers]();
  };

  return (
    <>
      <div className="playground-wrapper" onKeyUp={handle} tabIndex={0}>
        {blocked && <span className="error">LOSE</span>}
        <div className="playground-container" style={playgroundStyle}>
          <>
            {mapRender}
            {playground.map((block, blockIndex) => {
              if (!block?.value) return null;
              const positionStyle = {
                top: `${diff * block.position.top}%`,
                left: `${diff * block.position.left}%`,
                ...(block.withAnimation
                  ? { transition: 'top 0.2s ease-out, left 0.2s ease-out' }
                  : {}),
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
