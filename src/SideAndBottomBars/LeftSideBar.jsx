import ParsePlayerNames from '../PGNReader/ParsePlayerNames.js';
import { SelectedGames } from '../utils/selectedGames.js';

const LeftSideBar = ({ readPgn }) => {
  return (
    <div className="flex justify-center h-[200px] lg:h-[600px] m-0">
      <div className="bg-gray-800 w-[75%] md:w-[90%] mx-auto overflow-x-clip overflow-y-scroll">
        <div className="flex flex-row">
          <div className="flex justify-center place-self-center basis-2 grow text-sm leading-3 indent-0 h-8 mt-4 font-semibold text-slate-100">
            Selected Games
          </div>
        </div>
        {SelectedGames.map((game, index) => (
          <div
            key={game}
            onClick={() => {
              readPgn(game);
            }}
            className=" text-slate-300 justify-start gap-0 content-center py-2 px-4 bg-inherit font-semibold rounded-lg shadow-sm hover:bg-gray-700/50 focus:outline-none hover:text-slate-200 focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75 text-sm ml-1 h-16 w-52;shadow-md"
          >
            {ParsePlayerNames(game)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
