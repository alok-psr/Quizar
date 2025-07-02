import { React } from 'react'
import { useNavigate,useLocation } from 'react-router-dom'


function GameOver() {
    const navigate= useNavigate()
    const location = useLocation();
    const {  playerName } = location.state || {};
    const Rankings= [{name:playerName,pos:0},{name:'Jay',pos:1},{name:'Ravi',pos:2}]
    function goHomeButt(){
        navigate('/')
    }

  return (
    <div className='flex ml-4 flex-col h-lvh w-lvw justify-center items-center '>
        <h1 className='text-4xl text-center text-sky-100 '>Game Finished</h1>
        <h2 className='text-2xl text-slate-300 text-center'>Rankings ::</h2>
        <ul className='bg-slate-700 p-5 mt-3 rounded-lg '>
            {Rankings.map((player, ind) => (
                <li key={ind} className='text-yellow-200  text-xl'>
                the {ind + 1} position is held by {player.name}
                </li>
            ))}
        </ul>
        <span className='h-[1px] w-2/3 bg-slate-700 mt-5'></span>
        <button className='px-4 py-2 rounded-lg mt-10 bg-cyan-300 text-slate-800 text-center' onClick={goHomeButt}>Go Home</button>
    </div>
  )
}

export default GameOver