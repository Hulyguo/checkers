import { getColor } from "../utils/gameUtils";
import './piece.scss';

const Piece = (props: any) => {

  return(
    <div className={`
      piece piece--${getColor(props.piece.belongsTo)}
      ${props.piece.isKing && 'is-king'}
    `}/>
  );
}

export default Piece;