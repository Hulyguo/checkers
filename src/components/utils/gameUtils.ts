import { KingPiece } from "../../game-driver/KingPiece";
import { Piece } from "../../game-driver/Piece";
import { Player } from "../../game-driver/types/types";

export const getColor = (belongsTo: Player) => {
  switch(belongsTo) {
    case Player.BLACK:
      return 'black';
    case Player.WHITE:
      return 'white';
  }
}

export const isKingPiece = (piece: Piece) => {
  return piece instanceof KingPiece;
}