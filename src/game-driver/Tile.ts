import { Piece } from "./Piece";
import { Coordinates, Player } from "./types/types";

export class GameTile {
  private _piece: Piece | null = null;
  private _x: number;
  private _y: number;
  
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  public addPiece(belongsTo: Player) {
    this.piece = new Piece(belongsTo);
  }

  
  set piece(piece: Piece | null) { this._piece = piece; }
  
  get x() { return this._x; }
  get y() {  return this._y; }
  get piece() { return this._piece; }
  get coordinates() {
    return {
      x: this.x,
      y: this.y
    } as Coordinates;
  }
}