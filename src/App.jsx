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
  const [pgnValid, setPgnValid] = useState(undefined);
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
    <>
      <div className="border-2 border-red-200 m-0 p-0">
        <Header playerNames={playerNames}></Header>
        <main className="min-h-screen p-4">
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-4">
            {/* List Games */}
            <div className="order-4 lg:order-1 lg:w-84 lg:flex-shrink-0 border-2 border-gray-200 p-4">
              <LeftSideBar readPgn={readPgn} />
            </div>

            {/* ChessBoard */}
            <div className="order-1 lg:order-2 border-2 border-red-200 mx-auto mt-6">
              <Chessboard
                boardWidth={Math.min(560, window.innerWidth - 60)}
                id="BasicBoard"
                getPositionObject={getPos}
                position={chessBoardPosition}
              />
            </div>

            {/* Pieces */}
            <div className="order-3 lg:order-3 lg:w-84 lg:flex-shrink-0 border-2 border-red-200 p-4"></div>

            {/* Controls */}
            <div className="order-2 lg:order-4 lg:w-full border-2 border-red-200 p-4">
              <BottomBar
                currentPgn={currentPgn}
                setChessBoardPosition={setChessBoardPosition}
                getNextBoard={getNextBoard}
                getPreviousBoard={getPreviousBoard}
                getFirstBoard={getFirstBoard}
                getLastBoard={getLastBoard}
              />
            </div>

            {/* Import */}
            <div className="order-5 lg:order-5 lg:w-full border-2 border-red-200 p-4">
              <ImportGame
                pgnInput={pgnInput}
                readPgn={readPgn}
                currentPgn={currentPgn}
                pgnValid={pgnValid}
                setPgnValid={setPgnValid}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
