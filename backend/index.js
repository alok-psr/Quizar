import express, { urlencoded } from 'express'
import { Server } from 'socket.io'
import {createServer} from 'http'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const httpServer= createServer(app)

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// socket logic
const io = new Server(httpServer, {
    cors:{
        origin:[process.env.FRONTEND_URL], // change once the frontend is deployed
        methods:['GET','POST']
    }
})

const questions = []

// it takes in array of wrong options and a correct option and returns a randomized array of options and ans index in object
function getOpt(cor,wro){
    let randInd = Math.floor(Math.random()*4)

    if (randInd >= 3){
        const options = wro.concat(cor)
        return {options:options ,ans:randInd} 

    }else {
        let temp = wro[randInd]
        wro[randInd]= cor
        const options = wro.concat(temp)
        
        return {options:options ,ans:randInd} 
    }
    // {options : [optionA,OptionB ,...] : ans : int [index of ans in the options]
}
// the above fn getOpt used in socket.on('game-start') to get options and ans index from give args


const rooms = {} // should have the following data ::{roomCode :[ {id:socket.id of player, player: playername, isAdmin: true if the player was the host, inGame: if in a game set True else false}] } hence 3 vars roomCode,player name , socket.id
// rooms[room] is an array of all data of the players in a room ..in obj form ie ... rooms[room]===[{player1},{player2}.....]
// playerData ==  { .id , .player , isAdmin , inGame , gamePoints}
io.on('connection',(socket)=>{
    console.log('--------------------')


    // when create room triggered
    socket.on('create-room',(room,player)=>{
        if (!rooms[room]){
            rooms[room]=[]
        }

        // the first in the array becomes the admin
        const isAdmin = rooms[room].length === 0; 

        // adding player to the rooms[room]
        rooms[room].push({
            id: socket.id,
            name: player,
            isAdmin,
            inGame:false
        });
        socket.name = player
        socket.isAdmin=isAdmin
        socket.inGame = false

        // player joins the room
        socket.join(room)

        // update room and send the updated rooms[room] to every player within
        io.to(room).emit('room-update', rooms[room]);

        console.log('room-created \n -------------')
    })


    // when join room is triggered
    socket.on('join-room',(room,player)=>{
        if (!rooms[room]){
            rooms[room]=[]
        }
        // the first in the array becomes the admin
        const isAdmin = rooms[room].length === 0; 

        // setting internal values for the socket
        socket.name=player
        socket.isAdmin=isAdmin
        socket.inGame = false

        socket.join(room)
        // add player name and socket.id to the rooms[room]
        rooms[room].push({
            id:socket.id,
            name:player,
            isAdmin,
            inGame:false
        })

        // update room and send the updated rooms[room] to every player within
        io.to(room).emit('room-update', rooms[room]);

        console.log(` ${socket.name} -- room-joined \n ------------- `)
    })



    socket.on('leave-room', (room) => {
        socket.leave(room, () => console.log('bye !!'));

        if (rooms[room]) {
            // remove the player from the rooms[room]
            
            
            rooms[room] = rooms[room].filter(player => player.id !== socket.id);
            console.log(` ${socket.name} left room \n----------------`)
            // delete the room if empty
            if (rooms[room].length === 0) {
                delete rooms[room];
            }

        }
        // since the player left he cant be the admin
        socket.isAdmin=false


        // handeling making the next admin if the admin leaves

        // to prevent making rooms[room] undefined 
        if (!rooms[room]){
            rooms[room]=[]
        }

        // After removing the leaving player from rooms[room]:
        if (rooms[room].length > 0) {
            rooms[room][0].isAdmin = true; // Make the next player admin
        }

        io.to(room).emit('room-update', rooms[room]);

        });

    // socket on for start-game
    socket.on('start-game',async (room)=>{
        if (!rooms[room]){
            rooms[room]=[]
        }

        console.log('game started')

        // set inGame true for everyone in the room 
        rooms[room].forEach(e => {
            e['inGame']=true
            console.log(`${e.name} is in game ...`)
        });


        // getting ques 
        const res =await fetch('https://opentdb.com/api.php?amount=5&type=multiple')
        const questions = await res.json()
        const quesRes=questions['results'] 
        
        console.log(`Questions attained!!!`)
        
        const quesArr= quesRes.map(q=>{

            const fnOut = getOpt(q.correct_answer,q.incorrect_answers)
            const options = fnOut['options']
            const ansInd = fnOut['ans']

            return {text: q['question'],options:options , correct :ansInd}
        })        

        io.to(room).emit('game-started',rooms[room],quesArr)
      
    })

    socket.on('game-end',(room,cor,wro)=>{
        if (!rooms[room]){
            rooms[room]=[]
        }

        console.log(`game ended for ${socket.name}`)

        rooms[room].forEach((e)=>{
            socket.gamePoints = cor
            if (e.id==socket.id){
                e['gamePoints']=cor
                e['inGame']=false
                socket.inGame=false

            }
        })
        const ranks = getRankings(room) //ranks is array of obj :: [{name, pos (starts from 0)}]
        console.log(`${ranks} ranking till now`)
            
        // .every(condition) returns true when condition is true for every elemtnt of the array
        if (rooms[room].every(e=>e['inGame']==false)){
            console.log('triggered')
            io.to(room).emit('game-over',ranks)
        }
        
    })

    // will be used in socket.on(game-end)
    function getRankings(room){
        if (!rooms[room]){
            rooms[room]=[]
        }
        
        const sorted = [...rooms[room]].sort((a, b) => (b.gamePoints || 0) - (a.gamePoints || 0));

        console.log('sorted array....',sorted.map((player,i)=>({
            name:player.name,
            pos:i,
            score:player.gamePoints
        })))
        return sorted.map((player,i)=>({
            name:player.name,
            pos:i,
        }))
    }

})

app.get('/',(req,res)=>{
    res.json({msg:'Running !!!',name:'alok'})
})

app.get('/health',(req,res)=>{
    res.send('backend is live')
})

