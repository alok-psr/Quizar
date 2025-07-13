import {io} from 'socket.io-client'
import dotenv from 'dotenv'
dotenv.config({path:'../.env'})

const backend_server = process.env.BACKEND_SERVER

const socket = io(backend_server,{
    autoConnect:false,
    withCredentials: true,
    transports: ['websocket'],
})

export default socket