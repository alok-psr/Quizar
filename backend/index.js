import express, { urlencoded } from 'express'
import { Server } from 'socket.io'
import {createServer} from 'http'

const PORT = 8080


const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())

const httpServer= createServer(app)

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// socket logic
const io = new Server(httpServer, {
    cors:{
        origin:['http://localhost:5173'],
        methods:['GET','POST']
    }
})



const rooms = {} // should have the following data ::{roomCode : {id:socket.id of player, player: playername, isAdmin: true if the player was the host, inGame: if in a game set True else false}} hence 3 vars roomCode,player name , socket.id

io.on('connection',(socket)=>{
    console.log("all the conenctions' id are :  "  )
    console.log(Array.from(io.sockets.sockets.keys()))
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
        socket.name= player
        socket.isAdmin=isAdmin
        socket.inGame = false

        // player joins the room
        socket.join(room)

        // update room and send the updated rooms[room] to every player within
        io.to(room).emit('room-update', rooms[room]);

        console.log('create-rooms \n -------------')
        console.log(`${rooms} \n -----------------`)
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
            inGAme:false
        })

        // update room and send the updated rooms[room] to every player within
        io.to(room).emit('room-update', rooms[room]);

        console.log('join-rooms \n ------------- ')
        console.log(rooms)
        console.log(socket.name)
    })

    socket.on('leave-room', (room) => {
        socket.leave(room, () => console.log('bye !!'));

        if (rooms[room]) {
            // remove the player from the rooms[room] 
            rooms[room] = rooms[room].filter(player => player.id !== socket.id);

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
    socket.on('start-game',(room)=>{
        if (!rooms[room]){
            rooms[room]=[]
        }

        // set inGame true for everyone in the room 
        rooms[room].forEach(e => {
            e['inGame']=true
        });
        io.to(room).emit('game-started',rooms[room])

    })
})

app.get('/',(req,res)=>{
    res.json({msg:'Running !!!',name:'alok'})
})

