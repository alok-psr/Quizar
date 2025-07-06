import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';


// // you send somethiing by using socket.emit and handle recieving something by socket.on()
// socket.on('connect',()=>{

// }) // this is triggered everytime a player is connected to the websocket


// socket.emit('event-name', 10,'alok',{1:223}) // this transfers data to the server .. first arg is the name of the data and things after that are the data being transferred .. it can be anything string or num or object or array jst have to be fron the 2nd place after the name of the data:: this is recieved in the server by socket.on('event-name', (callback->the args are the data .. eg a,b,c ===> a will be 10 , b will be 'alok'  and c will the be the obj passed here))

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);