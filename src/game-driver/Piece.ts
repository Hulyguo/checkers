import { Direction, Player } from "./types/types";

export class Piece {
  private _belongsTo: Player; 
  private _isKing: boolean = false;
  private _directionsOfMovement: number[] = [];

  constructor(belongsTo: Player) {
    this._belongsTo = belongsTo;
    this._directionsOfMovement.push(belongsTo === Player.BLACK ? Direction.DOWN : Direction.UP);
  }

  public belongsToPlayer(player: Player) {
    return this._belongsTo === player;
  }

  get belongsTo() { return this._belongsTo; }
  get directionsOfMovement() { return this._directionsOfMovement; }
  get isKing() { return this._isKing; }

  set isKing(value: boolean) { this._isKing = value; }
}