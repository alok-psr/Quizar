import { React } from 'react'
import { useNavigate } from 'react-router-dom'
import socket from '../sockets/socket.js'
import { useState } from 'react';

function GameOver() {
    const navigate= useNavigate()
    const [allOver,setAllOver] =useState(false)
    const [Rankings,setRankings] = useState([])
    

    function goHomeButt(){
        navigate('/')
    }


    socket.on('game-over',(ranks)=>{
        setAllOver(true)
        setRankings(ranks)
        console.log(ranks)
    })


  return (
    <div className='flex ml-4 flex-col h-lvh w-lvw justify-center items-center '>
        <h1 className='text-4xl text-center text-sky-100 '>Game Finished</h1>
        <h2 className='text-2xl text-slate-300 text-center'>Rankings ::</h2>
        <ul className='bg-slate-700 p-5 mt-3 rounded-lg '>
            {!allOver && <span className='text-3xl text-center text-white '>Wait for others to finish</span>}
            {allOver&& Rankings.map((player, ind) => (
                <li key={ind} className={`text-yellow-200 ${player.pos==0 ? 'bg-blue-500 text-2xl' : 'bg-green-500'} rounded  text-xl`}>
                the {player.pos + 1} position is held by {player.name}
                </li>
            ))}
        </ul>
        <span className='h-[1px] w-2/3 bg-slate-700 mt-5'></span>
        <button className='px-4 py-2 rounded-lg mt-10 bg-cyan-300 text-slate-800 text-center' onClick={goHomeButt}>Go Home</button>
    </div>
  )
}

export default GameOver