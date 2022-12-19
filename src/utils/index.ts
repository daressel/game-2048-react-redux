import { IBlock, IPlayground, Position } from './../types/index';

export const initMap = (height: number, width: number): Position[] => {
  const map: Position[] = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const position: Position = {
        left: col,
        top: row,
      };
      map.push(position);
    }
  }

  return map;
};

export const addBlocks = (data: {
  playground: IPlayground;
  count: number;
  map: Position[];
}): void => {
  const { playground, map, count: dataCount } = data;

  const possiblePlaces = map.filter(
    (position) =>
      !playground.some(
        (block) => block.position.top === position.top && block.position.left === position.left
      )
  );

  const possibleLength = possiblePlaces.length;
  const count = dataCount > possibleLength ? possibleLength : dataCount;

  const reservedIndexes: number[] = [];
  let randomIndex: number = Math.floor(Math.random() * possibleLength);

  while (reservedIndexes.length < count) {
    randomIndex = Math.floor(Math.random() * possibleLength);

    if (reservedIndexes[randomIndex]) continue;

    const newBlock: IBlock = {
      position: possiblePlaces[randomIndex],
      value: 2,
    };

    reservedIndexes.push(randomIndex);
    playground.push(newBlock);
  }
};

export const initPlayground = (map: Position[]): IPlayground => {
  const playground: IPlayground = [];
  const count = Math.round(2);
  addBlocks({ playground, count: 10, map });

  return playground;
};
