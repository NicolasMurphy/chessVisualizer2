import './App.css';
import { Chessboard } from 'react-chessboard';
import { useEffect, useState, useMemo } from 'react';
import { squareToMatrixIndex } from './utils/squareToMatrix';
import { processChessBoard } from './utils/processChessBoard';
import { calcSqs } from './ColorCalcFunctions/calcSqs';
import {
  matrixIndexToChessNotation,
  isWhiteSquare,
  boardToFen,
} from './utils/PureFuncs.js';
import { Chess } from 'chess.js';
import ImportGame from './PGNReader/ImportGame';
import PgnReader from './PGNReader/PgnReader.js';
import BottomBar from './SideAndBottomBars/BottomBar';
// import RightSidebar from './SideAndBottomBars/RightSideBar.jsx';
import LeftSideBar from './SideAndBottomBars/LeftSideBar';
import { UseBoardArray } from './CustomHooks/UseBoardArray';
import { Header } from './Header';
import ParsePlayerNames from './PGNReader/ParsePlayerNames.js';
import { initialBoardFEN } from './utils/Constants.js';

export default function App() {
  const [posObject, setPositionObject] = useState([]);
  const [board, setBoard] = Array(8)
    .fill()
    .map(() => Array(8).fill(0));

  const [blackCtrlOn, setBlackCtrlOn] = useState(true);
  const [whiteCtrlOn, setWhiteCtrlOn] = useState(true);
  const [boardIsFlipped, setBoardIsFlipped] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const game = useMemo(() => new Chess(), []);
  const [chessBoardPosition, setChessBoardPosition] = useState(game.fen());
  const [boardArray, setBoardArray] = useState([]);

  ///---PGN states---///
  const [currentPgn, setCurrentPgn] = useState('');
  const [pgnValid, setPgnValid] = useState(true);
  const [playerNames, setPlayerNames] = useState('');

  const {
    updateBoardArray,
    getNextBoard,
    getPreviousBoard,
    getFirstBoard,
    getLastBoard,
    removeBoardArray,
  } = UseBoardArray();

  const pgnInput = e => {
    setCurrentPgn(e.target.value);
  };

  const readPgn = pgn => {
    let { boardArray, pgnIsValid } = PgnReader(pgn);
    setCurrentPgn(pgn);
    setPgnValid(pgnIsValid);
    setPlayerNames(ParsePlayerNames(pgn));
    setChessBoardPosition(initialBoardFEN);
    boardToFen(boardArray[10], 11);
    const fenArray = boardArray.map((board, index) => boardToFen(board, index));
    setBoardArray(fenArray);
    updateBoardArray(fenArray);
  };

  const getPos = pos => {
    const placeholderBoard = Array(8)
      .fill()
      .map(() => Array(8).fill(0));

    for (const key in pos) {
      const [row, col] = squareToMatrixIndex(key);
      placeholderBoard[row][col] = pos[key];
    }
    const processBoard = processChessBoard(placeholderBoard);
    const fenString = boardToFen(processBoard);
    const finalBoard = calcSqs(true, true, processBoard, false);

    const checkForNodes = finalBoard => {
      if (typeof window === 'undefined') return;
      const checkNode = finalBoard => {
        const square = document.querySelector("[data-square='a3']");
        if (square) {
          clearInterval(intervalId);
          finalBoard.map((row, rowIndex) => {
            row.map((col, colIndex) => {
              const squareNotation = matrixIndexToChessNotation(
                rowIndex,
                colIndex
              );
              const currentSquare = document.querySelector(
                `[data-square='${squareNotation}']`
              );
              const value = col;
              if (value >= 1) {
                currentSquare.className = `cell whiteSquare${value}`;
                currentSquare.style = '';
              } else if (value <= -1) {
                currentSquare.className = `cell blackSquare${value * -1}`;
                currentSquare.style = '';
              } else {
                const coords = isWhiteSquare([rowIndex, colIndex]);
                currentSquare.className = `cell ${coords}`;
                currentSquare.style = '';
              }
            });
          });
        }
      };
      const intervalId = setInterval(checkNode, 100);
      checkNode(finalBoard);
      return () => clearInterval(intervalId);
    };
    checkForNodes(finalBoard);
  };

  return (
    <div className="w-full h-full border-2 border-red-200 m-0 p-0">
      <Header playerNames={playerNames}></Header>
      <main className="grid grid-cols-[20%_80%] border">
        <aside>
          <LeftSideBar readPgn={readPgn} />
        </aside>
        <div className=" justify-center">
          <Chessboard
            id="BasicBoard"
            boardWidth={560}
            getPositionObject={getPos}
            position={chessBoardPosition}
          />
          <div className="grid gap-x-32">
            <ImportGame
              pgnInput={pgnInput}
              readPgn={readPgn}
              currentPgn={currentPgn}
              pgnValid={pgnValid}
            />
            <BottomBar
              currentPgn={currentPgn}
              setChessBoardPosition={setChessBoardPosition}
              getNextBoard={getNextBoard}
              getPreviousBoard={getPreviousBoard}
              getFirstBoard={getFirstBoard}
              getLastBoard={getLastBoard}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
