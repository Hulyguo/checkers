import { isKingPiece } from "../components/utils/gameUtils";
import { Board } from "./board/Board";
import { KingPiece } from "./KingPiece";
import { Piece } from "./Piece";
import { GameTile } from "./Tile";
import { END_COORDINATES, Player, START_COORDINATES } from "./types/types";

export class GameManager {
  private _currentTurn: Player;
  private _board: Board;
  
  constructor() {
    this._currentTurn = Player.BLACK;
    this._board = Board.Instance;
  }

  public initialize() {
    this.board.initialize();
  }

  public selectTile(tile: GameTile | null) {
    this.board.setSelectedTile(tile, this.currentTurn);
  }

  public executeTurn(selectedTile: GameTile, tile: GameTile) {
    let pieceToMove = this.board.board[selectedTile.coordinates.y][selectedTile.coordinates.x].piece;
    if (pieceToMove && this.board.isMoveValid(tile.coordinates)) {
      this.toggleTurn();
      this.board.movePiece(selectedTile, tile);

      if (this.shouldMakeKing(pieceToMove, tile)) {
        this.board.board[tile.y][tile.x].piece = new KingPiece(pieceToMove);
      }
    }
    this.board.setSelectedTile(null);
    this.checkWinCondition();
  }

  private shouldMakeKing(pieceToMove: Piece, tile: GameTile) {
    if (isKingPiece(pieceToMove)) {
      return;
    }
    if (pieceToMove.belongsToPlayer(Player.BLACK)) {
      return tile.coordinates.y === END_COORDINATES;
    }
    return tile.coordinates.y === START_COORDINATES;
  }

  private checkWinCondition() {
    let whiteCount = 0; 
    let blackCount = 0;
      
    this.gameBoard.forEach(row => row.forEach(tile => {
      const piece = tile.piece;
      if (piece?.belongsToPlayer(Player.BLACK)) {
        blackCount++;
        return;
      }
      whiteCount++;
    }));
    if (blackCount === 0) alert("White won!");
    if (whiteCount === 0) alert("Black won!");
  }

  private toggleTurn() {
    this.currentTurn = this.currentTurn === Player.BLACK ? Player.WHITE : Player.BLACK;
  }

  get selectedTile() { return this._board.selectedTile; }
  get gameBoard() { return this._board.board; }
  get board() { return this._board; }
  get possibleMoves() { return this.board.possibleMoves; }
  get currentTurn() { return this._currentTurn; }

  set currentTurn(player: Player) { this._currentTurn = player }
}