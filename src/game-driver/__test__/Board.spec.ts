import { Board } from "../board/Board";
import { Piece } from "../Piece";
import { Player } from "../types/types";


test('Should find possible jumps', () => {
  const w1 = generatePiece(4, 4, Player.WHITE);
  const b1 = generatePiece(3, 3, Player.BLACK);
  const b2 = generatePiece(5, 3, Player.BLACK);
  const pieces = [w1, b1, b2];

  const board = Board.Instance;
  board.initialize(pieces);

  const possibleMoves = board.findMoves(board.board[4][4]);

  expect(possibleMoves.length).toBe(2);
  expect(possibleMoves[0].wouldDelete).toEqual([{x: 5, y: 3}]);
  expect(possibleMoves[1].wouldDelete).toEqual([{x: 3, y: 3}]);
});

test('Should find multijumps', () => {
  const w1 = generatePiece(4, 4, Player.WHITE);
  const b1 = generatePiece(1, 1, Player.BLACK);
  const b2 = generatePiece(3, 3, Player.BLACK);
  const b3 = generatePiece(5, 1, Player.BLACK);
  const b4 = generatePiece(5, 3, Player.BLACK);
  const pieces = [w1, b1, b2, b3, b4];

  const board = Board.Instance;
  board.initialize(pieces);

  const possibleMoves = board.findMoves(board.board[4][4]);

  expect(possibleMoves.length).toBe(4);
  expect(possibleMoves[0].wouldDelete).toEqual([{x: 5, y: 3}]);
  expect(possibleMoves[1].wouldDelete).toEqual([{x: 3, y: 3}]);
  expect(possibleMoves[2].wouldDelete).toEqual([{x: 5, y: 1}, {x:5, y: 3}]);
  expect(possibleMoves[3].wouldDelete).toEqual([{x: 1, y: 1}, {x:3, y: 3}]);
});

test('Should not allow backwards movement if not king', () => {
  const w1 = generatePiece(4, 4, Player.WHITE);
  const pieces = [w1];

  const board = Board.Instance;
  board.initialize(pieces);
  const possibleMoves = board.findMoves(board.board[4][4]);

  expect(possibleMoves).not.toEqual(expect.arrayContaining([
    expect.objectContaining({
      x: 3,
      y: 5,
    }),
    expect.objectContaining({
      x: 5,
      y: 5,
    }),
  ]));
});


const generatePiece = (x: number, y: number, belongsTo: Player) => ({
  x,
  y,
  belongsTo
});
