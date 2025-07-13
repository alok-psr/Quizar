import {io} from 'socket.io-client'

const backend_server = 'https://quizar.onrender.com'

const socket = io(backend_server,{
    autoConnect:false,
    withCredentials: true,
    transports: ['websocket'],
})

export default socket