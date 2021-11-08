import { Player } from "../../game-driver/types/types";

export const getColor = (belongsTo: Player) => {
  switch(belongsTo) {
    case Player.BLACK:
      return 'black';
    case Player.WHITE:
      return 'white';
  }
}