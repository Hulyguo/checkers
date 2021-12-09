import { GameTile } from "../Tile";
import { BOARD_SIZE, Coordinates, Direction, Move, Player } from "../types/types";
import { initialPieces } from "./data";


export class Board {
  private static _instance: Board;
  private constructor() {}

  private _board: GameTile[][] = [];
  private _selectedTile: GameTile | null = null;
  private _possibleMoves: Move[] = [];

  public static get Instance() {
    return this._instance || (this._instance = new this());
  }


  public initialize(board?: any) {
    this.resetBoard();
    this.setInitialBoard(board);
  }

  public movePiece(from: Coordinates, to: Coordinates) {
    const pieceToMove = this.getPieceFromCoordinates(from.x, from.y);
    if (pieceToMove) {
      const toDelete = this.possibleMoves.find((move) => move.coordinates.x === to.x && move.coordinates.y === to.y);
      toDelete?.wouldDelete.forEach((tile) => this.board[tile.y][tile.x].piece = null);
      this.board[from.y][from.x].piece = null;
      this.board[to.y][to.x].piece = pieceToMove;
      this.possibleMoves = [];
    }
  }

  public isMoveValid(to: Coordinates) {
    return this.possibleMoves.some((move) => {
      return to.x === move.coordinates.x && to.y === move.coordinates.y;
    });
  }

  public findMoves(tileToMove: GameTile): Move[] {
    const pieceToMove = tileToMove.piece;

    if (!pieceToMove) {
      return [];
    }
    
    const possibleMoves: Move[] = [];
    const directionOfMotion = pieceToMove.directionOfMotion;
    const leftOrRight = [Direction.RIGHT, Direction.LEFT];
    
    for (let j = 0; j < directionOfMotion.length; j++) {
      possibleMoves.push(
        ...this.getMovesForTile(leftOrRight, tileToMove, directionOfMotion[j])
      );
    }

    const jumps = this.findJumps(tileToMove.x, tileToMove.y, [], [], directionOfMotion, pieceToMove.belongsTo);
    jumps.forEach(jump => {
      possibleMoves.push(jump);
    });
    
    return possibleMoves;
  }

  public getMovesForTile(leftOrRight: Direction[], tileToMove: GameTile, directionOfMotion: number) {
    const possibleMoves = [];
    for (let i = 0; i < leftOrRight.length; i++) {
      const moveY = tileToMove.y + directionOfMotion;
      const moveX = tileToMove.x + leftOrRight[i];
      
      if (
        this.board[moveY] !== undefined &&
        this.board[moveY][moveX] !== undefined &&
        this.board[moveY][moveX].piece === null
      ) {
        possibleMoves.push({
          coordinates: {
            x: moveX,
            y: moveY,
          },
          wouldDelete: []
        });
      }
    }
    return possibleMoves;
  }

  public findJumps(x: number, y: number, possibleJumps: Move[], wouldDelete: Coordinates[], directions: number[], activePlayer: Player): Move[] {
    let thisIterationDidSomething = false;
    const leftOrRight = [Direction.RIGHT, Direction.LEFT];

    for (let k = 0; k < directions.length; k++) {
      for (let l = 0; l < leftOrRight.length; l++) {
        if (this.isJumpAvailable(y, x, directions[k], leftOrRight[l], activePlayer)) {
          if (possibleJumps.map(
            ({coordinates}) => `${coordinates.y}${coordinates.x}`
          ).indexOf(String(y + (directions[k] * 2)) + String(x + (leftOrRight[l] * 2))) < 0) {
            const newJump: Move = {
              coordinates: {
                y: y + (directions[k] * 2),
                x: x + (leftOrRight[l] * 2),
              },
              wouldDelete:[
                {
                  y: y + directions[k],
                  x: x + leftOrRight[l]
                }
              ]
            };
            wouldDelete.forEach(coordinatesToDelete => {
              newJump.wouldDelete.push(coordinatesToDelete);
            });
            possibleJumps.push(newJump);
            thisIterationDidSomething = true;
          }
        }
      }
    }
    if (thisIterationDidSomething) {
      possibleJumps.forEach(jump => {
				const coords = [jump.coordinates.x, jump.coordinates.y];
				const children = this.findJumps(coords[0], coords[1], possibleJumps, jump.wouldDelete, directions, activePlayer);
				children.forEach(child => {
					if (possibleJumps.indexOf(child) < 0) {
						possibleJumps.push(child);
					}
        })
      });
		}
		return possibleJumps;
  }

  public isJumpAvailable(y: number, x: number, vertical: Direction, horizontal: Direction, activePlayer: Player) {
    return this.board[y + vertical] &&
      this.board[y + vertical][x + horizontal] &&
      this.board[y + vertical][x + horizontal].piece &&
      this.board[y + (vertical * 2)] &&
      this.board[y + (vertical * 2)][x + (horizontal * 2)] &&
      this.board[y + vertical][x + horizontal].piece?.belongsTo !== activePlayer &&
      !this.board[y + (vertical * 2)][x + (horizontal * 2)].piece  
  }

  public setSelectedTile(tile: GameTile | null, currentTurn?: Player) {
    if (tile?.piece?.belongsTo === currentTurn) {
      this.selectedTile = tile;
      if (tile) {
        this.possibleMoves = this.findMoves(tile);
        return;
      }
    }

    this.possibleMoves = [];
  }

  private resetBoard() {
    const newBoard: GameTile[][] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      newBoard[y] = [];
      for (let x = 0; x < BOARD_SIZE; x++) {
        newBoard[y][x] = new GameTile(x, y);
      }
    }
    this.board = newBoard;
  }

  private setInitialBoard(pieces: any) {
    const piecesToSet = pieces || initialPieces;
    for (const { x, y, belongsTo } of piecesToSet) {
      this.board[y][x].addPiece(belongsTo);
    }
  }

  private getPieceFromCoordinates(x: number, y: number) {
    return this.board[y][x].piece;
  }

  get possibleMoves() { return this._possibleMoves; }
  get selectedTile() { return this._selectedTile; }
  get board() { return this._board; }

  set possibleMoves(moves: Move[]) { this._possibleMoves = moves; }
  set selectedTile(tile: GameTile | null) { this._selectedTile = tile; }
  set board(board: GameTile[][]) { this._board = board }
}