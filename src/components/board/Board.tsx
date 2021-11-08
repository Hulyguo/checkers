import { useEffect, useReducer, useState } from "react";
import { GameManager } from "../../game-driver/GameManager";
import { GameTile } from "../../game-driver/Tile";
import Row from "../row/Row";
import { getColor } from "../utils/gameUtils";
import './board.scss';

const Board = (props: any) => {
	const [gameManager] = useState(new GameManager());
	const [, forceUpdate] = useReducer(x => x + 1, 0);
	const [debug, setDebug] = useState(false);

	useEffect(() => {
		gameManager.initialize();
		forceUpdate();
	}, [gameManager])

	const onSelectTile = (tile: GameTile) => {
		const selectedTile = gameManager.selectedTile;
		if (selectedTile) {
			gameManager.executeTurn(selectedTile, tile);
		} else {
			gameManager.selectTile(tile);
		}
		forceUpdate();
	}

	return (
    <div className="container">
			<h1 style={{color: `${getColor(gameManager.currentTurn)}`}}>Current turn: {getColor(gameManager.currentTurn)}</h1>
      <div className="board">
        {
          gameManager.gameBoard.map((tiles, index)=> {
						return (
							<Row
								key={index}
								tiles={tiles}
								onSelectTile={(tile: GameTile) => onSelectTile(tile)}
								selectedTile={gameManager.selectedTile}
								possibleMoves={gameManager.possibleMoves}
								debug={debug}
							/>
						);
					})
        }
      </div>
			<button className="board__debug" onClick={() => setDebug(!debug)}>Toggle debug</button>
    </div>
  );
};

export default Board;