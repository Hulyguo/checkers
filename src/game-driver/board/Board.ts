import { GameTile } from "../Tile";
import { BOARD_SIZE, Coordinates, Direction, Move, Player } from "../types/types";
import { initialPieces } from "./data";


export class Board {
  private _board: GameTile[][] = [];
  private _selectedTile: GameTile | null = null;
  private _possibleMoves: Move[] = [];


  public initialize() {
    this.resetBoard();
    this.setInitialBoard();
  }

  public movePiece(from: Coordinates, to: Coordinates) {
    const pieceToMove = this.getPieceFromCoordinates(from.x, from.y);
    if (pieceToMove && this.isMoveValid(to)) {
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
    if (pieceToMove) {
      const possibleMoves: Move[] = [];
      const directionOfMotion = [pieceToMove.belongsTo === Player.BLACK ? Direction.DOWN : Direction.UP];
      const leftOrRight = [Direction.RIGHT, Direction.LEFT];

      if (pieceToMove.isKing) {
        directionOfMotion.push(directionOfMotion[0] * -1);
      }
      
      for (let j = 0; j < directionOfMotion.length; j++) {
        for (let i = 0; i < leftOrRight.length; i++) {
          const moveY = tileToMove.y + directionOfMotion[j];
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
      }

      const jumps = this.findJumps(tileToMove.x, tileToMove.y, [], [], directionOfMotion[0], pieceToMove.isKing, pieceToMove.belongsTo);
      jumps.forEach(jump => {
        possibleMoves.push(jump);
      });
      
      return possibleMoves;
    }
    return [];
  }

  public findJumps(x: number, y: number, possibleJumps: Move[], wouldDelete: Coordinates[], directionOfMotion: number, isKing: boolean, activePlayer: Player): Move[] {
    let thisIterationDidSomething = false;
    const directions = [directionOfMotion];
    const leftOrRight = [Direction.RIGHT, Direction.LEFT];
    
    if (isKing) {
      directions.push(directionOfMotion * -1);
    }

    for (let k = 0; k < directions.length; k++) {
      for (let l = 0; l < leftOrRight.length; l++) {
        if (
          this.board[y + directions[k]] &&
          this.board[y + directions[k]][x + leftOrRight[l]] &&
          this.board[y + directions[k]][x + leftOrRight[l]].piece &&
          this.board[y + (directions[k] * 2)] &&
          this.board[y + (directions[k] * 2)][x + (leftOrRight[l] * 2)] &&
          this.board[y + directions[k]][x + leftOrRight[l]].piece?.belongsTo !== activePlayer &&
          !this.board[y + (directions[k] * 2)][x + (leftOrRight[l] * 2)].piece  
        ) {
          console.log(this.board[y][x]);
          console.log(this.board[y + directions[k]][x + leftOrRight[l]]);
          // REFACTOR .some()
          if (possibleJumps.map(
            ({coordinates}) => `${coordinates.y}${coordinates.x}`
          ).indexOf(String(y + (directions[k] * 2))+String(x + (leftOrRight[l] * 2))) < 0) {
            const newJump: Move = {
              coordinates: {
                y: y + (directions[k]*2),
                x: x + (leftOrRight[l]*2),
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
				const children = this.findJumps(coords[0], coords[1], possibleJumps, jump.wouldDelete, directionOfMotion, isKing, activePlayer);
				for (const child of children) {
					if (possibleJumps.indexOf(child) < 0) {
						possibleJumps.push(child);
					}
				}
      });
		}
		return possibleJumps;
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

  private setInitialBoard() {
    for (const {x, y, belongsTo} of initialPieces) {
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