import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlayerList from '../components/PlayerList';
import socket from '../sockets/socket.js'



function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerName, quesArr } = location.state || {};


  // Proxy Qustion till server sends the actual questoins

  const [currentIndex, setCurrentIndex] = useState(0);
  const [question, setQuestion] = useState(quesArr[0]);

  // steps to get Question Bank and show the questions .. randomly 
  // first get an array of all ques using the ''socket.emit(get-questions)' on method' 
  // randomize the questions array
  // show the questions from randomized array with their index like 0,1,2,3... 
  // this randomized array will be different for each player but the questions will be the same like sequence of ques they get will be diff


  // 
  // socket.on('get-questions',(questions)=>{

  // })


  const [selected, setSelected] = useState(null);
  const [timer, setTimer] = useState(10); // countdown seconds
  const [correct, setCorrect] = useState(0);
  const [wrong,setWrong] = useState(0)

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

    const totQues = quesArr.length - 1


    setSelected(index);
    if (index === question.correct) {
      alert('Correct!');
      setCorrect(correct+1)
      

      if (currentIndex < totQues) {
        setCurrentIndex(currentIndex + 1);
        setQuestion(quesArr[currentIndex + 1]);
        setTimer(10);
      } else {
        navigate('/gameover', { state: { playerName } });
      }
    
    }else {
      alert('Wrong!');
      setWrong(wrong+1)
      if (currentIndex < totQues) {
        setCurrentIndex(currentIndex + 1);
        setQuestion(quesArr[currentIndex + 1]);
        setTimer(10);
      } else {
        navigate('/gameover', { state: { playerName } });
      }
    }
    console.log('current indes::',currentIndex)
    if (currentIndex==4){
      console.log('game ended from frontend side')
      socket.emit('game-end',roomCode,correct,wrong)
    }
};


  const handleTimeout = () => {
    alert("Times up!");
    let i=0 
    if (wrong >= 5) {
      navigate('/gameover');
    } else {
      setTimer(10); // Restart bomb for demo
      setWrong(wrong+1)
      setQuestion(quesArr[i])
      i++
    }
  };
    

  return (
    
    <div className='flex gap-1 '>
        
    <div className="w-lvw h-lvh bg-slate-900 flex flex-col items-center justify-center gap-8 text-white px-4">
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
              className={`px-4 py-2 rounded-lg transition-all duration-200 bg-indigo-500 hover:bg-indigo-600`}>{option}</button>
          ))}
        </div>
      </div>

      {/* Lives */}
      <div className="flex gap-2 text-red-500 text-xl mt-4">
        {Array(5).fill('').map((e,i)=>(
          <span key={i}>{i<wrong?'❌':'⭕' } </span>
        ))}
        <span>Score: {correct}/5</span>
      </div>
    </div>
    </div>
  );
}

export default Game;
