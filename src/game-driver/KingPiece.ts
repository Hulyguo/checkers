import { Piece } from "./Piece";

export class KingPiece extends Piece {

  constructor(piece: Piece) {
    super(piece.belongsTo);
  }

  get directionOfMotion() {
    return [-1, 1];
  }
}