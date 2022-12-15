export interface IBlock {
  value: number;
  color?: string;
  position: {
    top: string;
    left: string;
  };
}

export interface IPlaygroundProps {
  size?: number;
}

export type IPlayground = IBlock[][];
