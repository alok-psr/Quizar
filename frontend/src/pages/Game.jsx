import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList';

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerName } = location.state || {};

  // Proxy Qustion till server sends the actual questoins
  const [question, setQuestion] = useState({
    text: 'What is the capital of France?',
    options: ['Berlin', 'Paris', 'Rome', 'Madrid'],
    correct: 1, // index of 'Paris'
  });

  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(10); // countdown seconds
  const [strikes, setStrikes] = useState(0);

  useEffect(() => {
    if (!roomCode || !playerName) {
      navigate('/');
    }
  }, [roomCode, playerName, navigate]);

  // Countdown 
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else {
      handleTimeout();
    }
  }, [timer]);

  const handleAnswer = (index) => {
    setSelected(index);
    if (index === question.correct) {
      alert('Correct!');
      // navigate('/game'); // or pass bomb 
      setTimer(10); // reset timer for demo
    } else {
      alert('Wrong!');
      setStrikes(strikes + 1);
      setTimer(10); // reset timer for demo

      if (strikes + 1 >= 2) {
        navigate('/gameover', { state: { playerName } });
      }
    }
  };

  const handleTimeout = () => {
    alert('Time’s up! You exploded 💥');
    setStrikes(strikes + 1);

    if (strikes + 1 >= 2) {
      navigate('/gameover', { state: { playerName } });
    } else {
      setTimer(10); // Restart bomb for demo
    }
  };
    const players = [
        { name: playerName, status: 'active' },
        { name: 'Ravi', status: 'passive' },
        { name: 'Jay', status: 'eliminated' },
    ];

  return (
    
    <div className='flex gap-1 '>
        <div className="absolute left-10 bg-slate-900 text-white  flex">
        {/* Sidebar */}
        <div className="w-1/4 flex justify-center items-center p-4">
            <PlayerList players={players} />
      </div>
      </div>
    <div className="w-lvw h-lvh bg-slate-900 flex flex-col items-center justify-center gap-8 text-white px-4">
      <h2 className="text-2xl">Bomb Question Round</h2>
      <p className="text-sm text-slate-400">Player: {playerName} | Room: {roomCode}</p>

      {/* timer clock */}
      <div className="w-32 h-32 bg-red-600 rounded-full flex items-center justify-center text-4xl font-bold shadow-xl animate-pulse">
        {timer}
      </div>

      {/* Question Box */}
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-xl text-center">
        <h3 className="text-xl mb-4">{question.text}</h3>
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selected === index
                  ? index === question.correct
                    ? 'bg-green-600'
                    : 'bg-red-600'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Lives */}
      <div className="flex gap-2 text-red-500 text-xl mt-4">
        {Array(2)
          .fill()
          .map((_, i) => (
            <span key={i}>{i < strikes ? '❌' : '❤️'}</span>
          ))}
      </div>
    </div>
    </div>
  );
}

export default Game;
