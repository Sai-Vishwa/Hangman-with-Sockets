import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './Login';
import Game from './Game';
import Friend from './Friend';
import Signup from './Signup';


function App () {

  const [counter,setCounter] = useState(0);

  function count (){
    fetch("http://localhost:3205",{method:"POST",headers:{'Content-Type':'application/json'},body:""})
    .then(response => {return response.json();})
    .then(data=> {setCounter(data["count"])})
    }

  // useEffect(() => {
  //   const socket = io('http://localhost:3205', {
  //     withCredentials: true
  //   });

  //   socket.on('connect', () => {
  //     console.log('connected to server');
  //   });

  //   socket.on("data",(data)=>{console.log(data);})
  // }, []);

  return (




    <div>

      <BrowserRouter>
      <Routes>
        <Route path = "/" element={<Login />}/>
        <Route path='/search-look-friends' element={<Friend/>}/>
        <Route path = "/game" element={<Game sentence hint/>}/>
        <Route path = "/sign-up" element={<Signup />}/>
      </Routes>
      </BrowserRouter>
      
    </div>
  );
};

export default App;

















// import { useEffect, useState } from 'react'
// import './App.css'
// import io from 'socket.io-client'

// function App() {
//   let a = 10;
//   const socket = io('http://localhost:3205', {
//     withCredentials: true,
//     extraHeaders: {
//       'my-custom-header': 'abcd'
//     }
//   });

//   function connectSocket(){
//     socket.on('connection',(socket)=>{
//       console.log('hello');
//       a=20;
//     })
//   }

//   useEffect(()=>{connectSocket;},[])
 
//   return (
//     <>
//      <h2>Welcome to hangman</h2>
//      <h3>{a}</h3>
//     </>
//   )
// }

// export default App
