export enum Player {
  WHITE, BLACK
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Move {
  coordinates: Coordinates;
  wouldDelete: Coordinates[];
}

export enum Direction {
  UP = -1,
  DOWN = 1,
  LEFT = -1,
  RIGHT = 1,
}

export const BOARD_SIZE = 8;
export const START_COORDINATES = 0;
export const END_COORDINATES = BOARD_SIZE -1;