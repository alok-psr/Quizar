import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Lobby() {
  const navigate = useNavigate();

  // get the player name which the user entered in the home page through the navigate json
  const location = useLocation(); // cool trick
  const { roomCode, playerName } = location.state || {};

  // Proxy players list 
  const [players, setPlayers] = useState([playerName, "Ravi", "Jay"]);

  useEffect(() => {
    if (!playerName || !roomCode) {
      // If someone comes here without name like from the url redirect him to home 
      navigate('/');
    }
  }, [playerName, roomCode, navigate]);

  const handleStartGame = () => {
    // Later: emit socket "start-game"
    navigate('/game', { state: { roomCode, playerName } });
  };

  const handleLeave = () => {
    // Later: emit socket "leave-room"
    navigate('/');
  };

  return (
    <div className="w-lvw h-lvh flex flex-col items-center justify-center bg-slate-900 text-white gap-6 p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Room Code:</h1>
        <h2 className="text-purple-400 text-2xl tracking-widest bg-slate-800 px-6 py-2 rounded-lg">{roomCode}</h2>
      </div>

      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4 text-center">Players</h2>
        <ul className="flex flex-col gap-2">
          {players.map((player, ind) => (
            <li key={ind} className="bg-indigo-500 px-4 py-2 rounded text-white text-center">
              {player}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-purple-700 hover:bg-purple-600 px-6 py-2 rounded text-white"
          onClick={handleStartGame}
        >
          Start Game
        </button>
        <button
          className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded text-white"
          onClick={handleLeave}
        >
          Leave Room
        </button>
      </div>

      <p className="text-slate-500 text-sm mt-4">Waiting for more players...</p>
    </div>
  );
}

export default Lobby;
