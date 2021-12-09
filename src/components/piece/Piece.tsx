import { KingPiece } from "../../game-driver/KingPiece";
import { getColor } from "../utils/gameUtils";
import './piece.scss';

const Piece = (props: any) => {

  return(
    <div className={`
      piece piece--${getColor(props.piece.belongsTo)}
      ${props.piece instanceof KingPiece && 'is-king'}
    `}/>
  );
}

export default Piece;