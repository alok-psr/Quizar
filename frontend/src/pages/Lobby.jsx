import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import socket from '../sockets/socket.js'


// list of players joined the room is present 
// the first one to join/createe is the admin
// the admin can start the game
// every player has the option to leave the room 



function Lobby() {
  const navigate = useNavigate();

  // get the player name which the user entered in the home page through the navigate json
  const location = useLocation(); // cool trick
  const { roomCode, playerName } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [isAdmin,setIsAdmin] = useState(false)



  

  useEffect(() => {
    if (!playerName || !roomCode) {
      navigate('/');
    }
    socket.on('game-started',roomData=>{
      roomData.forEach(e=>{
        if (e.id==socket.id ){
          if (e.inGame == true){
            navigate('/game', { state: { roomCode, playerName } });
          }
        }
      })
    })

    const handleRoomUpdate =async (roomData) => {
      // when new player joins or leaves we get new roomData
      setPlayers(roomData);

      // if player is admin we set isAdmin to True :: only the Admin gets to start the Game
      const player = roomData.find((p) => p.id === socket.id);
      if (player?.isAdmin) {
        setIsAdmin(true);
      }
      
    };
    socket.on('room-update', handleRoomUpdate);

  }, [playerName, roomCode, navigate]);


  const handleStartGame = () => {
    navigate('/game')
    // sets the inGame property to true and emits game-started from the server
    socket.emit('start-game',roomCode)
    
    
  };

  const handleLeave = () => {

    

    // emit socket "leave-room"
    socket.emit('leave-room',roomCode)
    console.log(socket.inGame)
    navigate('/')
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
              {player.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        {isAdmin && (
          <button
            className="bg-purple-700 cursor-pointer hover:bg-purple-600 px-6 py-2 rounded text-white"
            onClick={handleStartGame}
          >
            Start Game
          </button>
        )}
        <button
          className="bg-red-600 cursor-pointer hover:bg-red-500 px-6 py-2 rounded text-white"
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
