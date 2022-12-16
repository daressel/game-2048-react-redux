import { IBlock, IPlayground } from './../types/index';
export const getRandomBlocksOnStart = (max: number, size: number): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < size; i++) {
    let randRow = Math.floor(Math.random() * max);
    let randBlock = Math.floor(Math.random() * max);

    let invalidCondition = result.some((el) => el[0] === randRow && el[1] === randBlock);

    while (invalidCondition) {
      randRow = Math.floor(Math.random() * max);
      randBlock = Math.floor(Math.random() * max);
      invalidCondition = result.some((el) => el[0] === randRow && el[1] === randBlock);
    }

    result.push([randRow, randBlock]);
  }
  return result;
};

export const getBlock = (top: string, left: string, value: number): IBlock => {
  const block: IBlock = { value, position: { left, top } };

  return block;
};

export const getNewRandomBlock = (data: IPlayground, size: number): void => {
  const diff = 100 / size;

  let randomRow = Math.floor(Math.random() * size);
  let randomCol = Math.floor(Math.random() * size);

  while (
    data.some((row, rowIndex) =>
      row.some(
        (block, blockIndex) => randomRow === rowIndex && randomCol === blockIndex && block.value
      )
    )
  ) {
    randomRow = Math.floor(Math.random() * size);
    randomCol = Math.floor(Math.random() * size);
  }

  data[randomRow][randomCol] = getBlock(`${randomRow * diff}%`, `${randomCol * diff}%`, 2);
};

export const initPlayground = (size: number): IPlayground => {
  const arr = Array.from(Array(size));
  const randomBlocks = getRandomBlocksOnStart(size, Math.floor(30));
  const diff = 100 / size;
  arr.forEach((el, rowIndex) => {
    arr[rowIndex] = Array.from(Array(size)).map((block, blockIndex) => {
      const condition = randomBlocks.some((el) => el[0] === rowIndex && el[1] === blockIndex);
      return getBlock(`${rowIndex * diff}%`, `${blockIndex * diff}%`, condition ? 2 : 0);
    });
  });

  return arr;
};
