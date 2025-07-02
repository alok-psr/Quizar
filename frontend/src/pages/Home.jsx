import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!roomCode || !playerName) {
      alert('Please enter both name and room code to join.');
      return;
    }
    // Later: emit socket join-room here
    navigate('/lobby', { state: { roomCode, playerName } });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName) {
      alert('Enter your name to create a room.');
      return;
    }

    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase(); // Random room code
    // Later: emit create-room socket event here
    navigate('/lobby', { state: { roomCode: newRoom, playerName } });
  };

  return (
    <div className='w-lvw h-lvh flex justify-center items-center py-20'>
      <form className='flex flex-col gap-4 bg-slate-700 w-2/3 rounded-lg p-8 justify-center items-center'>
        <input
          className='bg-indigo-400 px-4 py-2 rounded-lg text-white w-full text-center'
          type='text'
          placeholder='Enter Your Name'
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <div className='flex gap-4 justify-around w-full'>
          <input
            className='bg-indigo-400 px-4 py-2 rounded-lg text-white w-full text-center'
            type='text'
            placeholder='Room Code'
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />
          <button
            className='bg-purple-700 px-4 py-2 cursor-pointer rounded-lg w-32'
            onClick={handleJoin}
          >
            Join
          </button>
        </div>

        <span className='w-2/3 h-[1px] bg-slate-200'></span>

        <p className='text-sm text-slate-300'>or</p>
        <button
          className='bg-purple-700 px-4 py-2 cursor-pointer rounded-lg w-2/3'
          onClick={handleCreate}
        >
          Create Room
        </button>
      </form>
    </div>
  );
}

export default Home;
