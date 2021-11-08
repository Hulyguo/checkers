import { GameTile } from "../../game-driver/Tile";
import Tile from "../cell/Tile";
import './row.scss';

const Row = (props: any) => {
  return (
    <div className="row">
      {props.tiles.map(
        (tile: GameTile, index: number) => (
          <Tile
            debug={props.debug}
            key={index}
            tile={tile}
            onSelectTile={props.onSelectTile}
            selectedTile={props.selectedTile}
            possibleMoves={props.possibleMoves}
          />)
        )}
    </div>
  );
}

export default Row;
