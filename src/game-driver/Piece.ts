import { Direction, Player } from "./types/types";

export class Piece {
  private _belongsTo: Player; 

  constructor(belongsTo: Player) {
    this._belongsTo = belongsTo;
  }

  public belongsToPlayer(player: Player) {
    return this._belongsTo === player;
  }

  get belongsTo() { return this._belongsTo; }

  get directionOfMotion(): number[] {
    return [this.belongsTo === Player.BLACK ? Direction.DOWN : Direction.UP];
  }
}