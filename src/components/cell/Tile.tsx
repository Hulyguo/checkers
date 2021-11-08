import { GameTile } from "../../game-driver/Tile";
import { Coordinates, Move } from "../../game-driver/types/types";
import Piece from "../piece/Piece";
import './tile.scss';

const Tile = (props: any) => {
  const getBackground = (coordinates: Coordinates) => {
    return (coordinates.x++ - coordinates.y % 2) % 2 ? 'black' : 'white';
  }

  const isTileActive = (tile: GameTile) => {
    const selectedTile = props.selectedTile;
    if (!selectedTile || !tile.piece) return;
    return selectedTile.y === tile.y && selectedTile.x === tile.x; 
  }

  const possibleMove = () => {
    return props.possibleMoves.some((move: Move) => {
      return props.tile.x === move.coordinates.x && props.tile.y === move.coordinates.y;
    });
  }

  return(
    <div className={`tile tile--${getBackground(props.tile.coordinates)} 
      ${isTileActive(props.tile) ? 'active' : ''}
      ${possibleMove() ? 'can-move' : ''}
      `}
      onClick={() => props.onSelectTile(props.tile)}
    >
      {props.debug && (
        <div>
          <span className="tile__x">x:{props.tile.coordinates.x}</span>
          <span className="tile__y">y:{props.tile.coordinates.y}</span>
        </div>
      )}
      {props.tile.piece && <Piece piece={props.tile.piece}/>}
    </div>
  );
}

export default Tile;