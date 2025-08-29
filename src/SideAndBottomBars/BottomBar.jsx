import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBackwardFast,
  faBackwardStep,
  faForwardStep,
  faForwardFast,
} from '@fortawesome/free-solid-svg-icons';
import useKeyboardNavigation from '../CustomHooks/UseKeyboardNavigation';

const BottomBar = ({
  currentPgn,
  setChessBoardPosition,
  getNextBoard,
  getPreviousBoard,
  getLastBoard,
  getFirstBoard,
}) => {
  //arrow key event listeners
  const first = () => {
    setChessBoardPosition(getFirstBoard());
  };

  const next = () => {
    setChessBoardPosition(getNextBoard());
  };
  const prev = () => {
    setChessBoardPosition(getPreviousBoard());
  };
  const last = () => {
    setChessBoardPosition(getLastBoard());
  };
  useKeyboardNavigation(next, prev, last, first);

  return (
    <div className="gap-x-32 border-2 border-red-500 p-2">
      {currentPgn ? (
        <span className="border w-full h-full grid grid-cols-4">
          <span onClick={() => first()}>
            <FontAwesomeIcon icon={faBackwardFast} size="xl" />
          </span>
          <span onClick={() => prev()}>
            <FontAwesomeIcon icon={faBackwardStep} size="xl" />
          </span>
          <span onClick={() => next()}>
            <FontAwesomeIcon icon={faForwardStep} size="xl" />
          </span>
          <span onClick={() => last()}>
            <FontAwesomeIcon icon={faForwardFast} size="xl" />
          </span>
        </span>
      ) : (
        ''
      )}
    </div>
  );
};

export default BottomBar;
