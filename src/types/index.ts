export interface IBlock {
  value: number;
  color?: string;
  position: Position;
  withAnimation: boolean;
}

export interface Position {
  top: number;
  left: number;
}

export interface IPlaygroundProps {
  size?: number;
}

export type IPlayground = IBlock[];

export interface IAxisOpt {
  line: 'top' | 'left';
  block: 'top' | 'left';
}
