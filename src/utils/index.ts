import { IPlayground } from "./../types/index";
export const getRandomBlocksOnStart = (
  max: number,
  size: number
): number[][] => {
  const result: number[][] = [];
  for (let i = 0; i < size; i++) {
    let randRow = Math.floor(Math.random() * max);
    let randBlock = Math.floor(Math.random() * max);

    let invalidCondition = result.some(
      (el) => el[0] === randRow && el[1] === randBlock
    );

    while (invalidCondition) {
      randRow = Math.floor(Math.random() * max);
      randBlock = Math.floor(Math.random() * max);
      invalidCondition = result.some(
        (el) => el[0] === randRow && el[1] === randBlock
      );
    }

    result.push([randRow, randBlock]);
  }
  return result;
};

export const getNewRandomBlock = (
  data: number[][]
): { position: number[]; value: number } => {
  const size = data.length;

  return {
    position: [],
    value: 123,
  };
};

export const initPlayground = (size: number): IPlayground => {
  const arr = Array.from(Array(size));
  const randomBlocks = getRandomBlocksOnStart(size, Math.floor(size / 2));
  const diff = 100 / size;
  arr.forEach((el, rowIndex) => {
    arr[rowIndex] = Array.from(Array(size)).map((block, blockIndex) => {
      block = {};
      const condition = randomBlocks.some(
        (el) => el[0] === rowIndex && el[1] === blockIndex
      );

      block.value = condition ? 2 : 0;
      block.position = {
        top: `${rowIndex * diff}%`,
        left: `${blockIndex * diff}%`,
      };

      return block;
    });
  });

  return arr;
};
