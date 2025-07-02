import React from 'react';

function PlayerList({ players }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-yellow-400 text-black font-bold';
      case 'passive':
        return 'bg-indigo-500 text-white';
      case 'eliminated':
        return 'bg-gray-500 text-white line-through';
      default:
        return '';
    }
  };

  return (
    <div className="w-48 bg-slate-800 p-4 rounded-lg h-full">
      <h3 className="text-lg text-white mb-4">Players</h3>
      <ul className="flex flex-col gap-2">
        {players.map((player, i) => (
          <li
            key={i}
            className={`px-3 py-2 rounded text-center ${getStatusStyle(player.status)}`}
          >
            {player.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlayerList;
