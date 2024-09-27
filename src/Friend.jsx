import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3205');

function Play() {
  const myname = localStorage.getItem("name");
  const [consent , setconsent] = useState({"enakkuok" : false , "friendname" : "" , "friendkuok" : false})
  const nav = useNavigate();
  const [search,setsearch] = useState('');
  const [searchresult,setsearchresult] = useState([]);
  //const fl = localStorage.getItem("friends").split(",");
  let friendsandtheirstatus = {};
  //fl.forEach(elem => {friendsandtheirstatus[elem] = "offline"})

  const [fsrs , setfsrs] = useState(
                        {"friendsandstatus": friendsandtheirstatus,
                        "sent":[],
                        "received" :[],
                        "notification" : []})

  useEffect(() => {
    
    socket.emit("inside-friends-page",{"myname": localStorage.getItem("name")});
 
    socket.on("friendkuokila"+myname,(data)=>{
      
      alert("your friend rejected your request to play or probably your friend plays another game refresh the page for confirmation");
      setconsent({"enakkuok":false , "friendname":"" , "friendkuok" : false})
    })

    socket.on("friendkuok"+myname , (data)=>{
      if(consent["enakkuok"]){
        let sentence = "";
        let hint = "";
        localStorage.setItem("enname",myname);
        localStorage.setItem("gamefriendname",data);
        window.alert("friend accepted game's gonna begin");
        while(true){
          sentence = window.prompt("Un friend guess panna pora word / sentence ah type pannu");
          hint = window.prompt("Athukku oru hint kudu");
          sentence = sentence.toUpperCase();
          sentence=sentence.split(" ").filter(v => v!=="");
          sentence.forEach(v => {
            if(!/^[A-Za-z]+$/.test(v) && dummy == 0){
              alert("no number or special character is allowed");dummy+=1;
            }})
          if(dummy==0){break;}
          dummy =0;
        }
        localStorage.setItem("sentence",sentence);
        localStorage.setItem("hint",hint);
        nav("/game");
      }
      else{
        const willing = window.confirm("Your friend "+data+"called you for a game");
        if(willing){
          let dummy = 0;
          socket.emit("enakkuok",{"myname":myname,"friendname":data,"terminate":"yes"})
          localStorage.setItem("enname",myname);
          localStorage.setItem("gamefriendname",data);
          window.alert("game's gonna begin");
          while(true){
          let sentence = window.prompt("Un friend guess panna pora word / sentence ah type pannu");
          let hint = window.prompt("Athukku oru hint kudu");
          sentence = sentence.toUpperCase();
          sentence=sentence.split(" ").filter(v => v!=="");
          sentence.forEach(v => {
            if(!/^[A-Za-z]+$/.test(v) && dummy == 0){
              alert("no number or special character is allowed");dummy+=1;
            }})
          if(dummy==0){break;}
          dummy =0;
        }
        localStorage.setItem("sentence",sentence);
        localStorage.setItem("hint",hint);
          nav("/game");
        }
        else{
          socket.emit("enakkuokila",{"myname":myname,"friendname":data,"terminate":"yes"})
        }
      }
    })

    socket.on("statusofonefriend"+myname, (data)=>{
      alert("your friend "+data[1]+" came/went "+data[0]);
      let dummy = fsrs.friendsandstatus;
      dummy[data[1]]=data[0];
      setfsrs((previousState)=> {return ({"friendsandstatus":dummy , "sent" : previousState.sent , "received" : previousState.received})})
    })
    socket.on("statusofallfriends"+myname, (data)=>{
      setfsrs((previousState)=> {return ({"friendsandstatus":data , "sent" : previousState.sent , "received" : previousState.received})})
    })

    socket.on("allreceived"+myname, (data)=>{
      setfsrs((previousState)=> {return ({"friendsandstatus":previousState.friendsandstatus, "sent" : previousState.sent , "received" : data})})
    })

    socket.on("allsent"+myname, (data)=>{
      setfsrs((previousState)=> {return ({"friendsandstatus":previousState.friendsandstatus , "sent" : data , "received" : previousState.received})})
    })

    

    
    socket.on("friendadded"+myname , (data)=>{
      alert("New friend "+data[1]+" is added to your friends list");
      let dummy = fsrs.friendsandstatus;
      dummy[data[1]]=data[0];
      setfsrs((previousState)=> {return ({"friendsandstatus":dummy , "sent" : previousState.sent , "received" : previousState.received})})
    })

    socket.on("sentremoved"+myname,(data)=>{
      alert("your sent request to "+data+" is removed");
      setfsrs((previousState)=>{return ({"friendsandstatus":previousState.friendsandstatus,"sent":previousState.sent.filter(v => v!=data),
                                        "received":previousState.received})})
    })
    socket.on("receivedremoved"+myname,(data)=>{
      alert("Request received from "+data+" is removed");
      setfsrs((previousState)=>{return ({"friendsandstatus":previousState.friendsandstatus,"sent":previousState.sent,
                                        "received":previousState.received.filter(v => v!=data)})})
    })

    socket.on("sentadded"+myname,(data)=>{
      alert("Request sent to "+data)
      setfsrs((previousState)=>{return ({"friendsandstatus":previousState.friendsandstatus,"sent":[...previousState.sent , data],
        "received":previousState.received})})
    })
    socket.on("receivedadded"+myname, (data)=>{
      alert("Request received from "+data);
      setfsrs((previousState)=>{return ({"friendsandstatus":previousState.friendsandstatus,"sent":previousState.sent,
        "received":[...previousState.received , data]})})
    })
    socket.on("searchresult"+myname,(data)=>{
      console.log("inside search result")
      if(data == []){alert("No players available in that name")}
      setsearchresult(data)
    })


    // Clean up on component unmount
    return () => {
      socket.off('server-message');
    };
  }, []);

  

  function giveorwithdrawrequest(e){
    const list = e.target.id.split(",");
    if(list[2]=='withdraw'){
      socket.emit("withdrawrequest",{"myname":list[1],"friendname":list[0]})
    }
    else{
      if(fsrs.friendsandstatus[list[0]]){
        alert(list[0]+"is already your friend");
      }
      else if(fsrs.received.includes(list[0])){
        alert(list[0]+"have already sent you a connection request");
      }
      else if(fsrs.sent.includes(list[0])){
        alert("You have already sent a connection request to "+list[0]);
      }
      else{
      socket.emit("giverequest",{"myname":list[1],"friendname":list[0]})}
    }

  }
  function acceptorrejectrequest(e){
    const list = e.target.id.split(",");
    if(list[2]=='accept'){
      socket.emit("acceptrequest",{"myname":list[1],"friendname":list[0]})
    }
    else{
      socket.emit("rejectrequest",{"myname":list[1],"friendname":list[0]})
    }
  }
  function searchsetfunction(e){
    setsearch(e.target.value)
  }
  function serachdbfunction(e){
    console.log(myname + search)
    socket.emit("nametosearch",{"myname":{myname} , "searchname":{search}})
  }
  function gamebegins(e){
    if(consent.enakkuok == false){
      setconsent({"enakkuok":true , "friendname" :e.target.id, "friendkuok":false})
      socket.emit("enakkuok",{"myname":myname , "friendname":e.target.id , "terminate":"no"})
  }
    else{
      alert("aleady oru request anupirukka so konja neram summa iru");
    }
  }
  function logout(){
    socket.on("logout",myname);
    localStorage.clear();
    nav("/");
  }
  return (
  <div>
    <h2>My Name is {myname}</h2>
    <h2>My friends and their status</h2>
    <ul>
      {
        Object.keys(fsrs.friendsandstatus).map((KEY) => (
          <li key={KEY}>{KEY}
          <button id={KEY} onClick={gamebegins} disabled = {fsrs.friendsandstatus[KEY]=="online"?false:true}>{fsrs.friendsandstatus[KEY]}</button>
          </li>
        ))
      }
    </ul>

    <h2>Notifications</h2>
    <ul>
    { fsrs.notification.map((item,index)=> (
    <li key={index}>{item}
    <br />
    </li>)) }
    </ul>

    <h2>Requests sent</h2>
    <ul>
    { fsrs.sent.map((item,index)=> (
    <li key={index}>{item}
    <button  id={item+','+myname+',withdraw'} onClick={giveorwithdrawrequest}>withdraw</button>
    <br />
    </li>)) }
    </ul>

    <h2>Requests received</h2>
    <ul>
    {fsrs.received.map((item,index)=> (
    <li key={index}>{item}
    <button  id={item+','+myname+',accept'} onClick={acceptorrejectrequest}>Accept</button>
    <button id={item+','+myname+',reject'} onClick={acceptorrejectrequest}>reject</button>
    <br />
    </li>)) }
    </ul>

    <h2>Search a player</h2>
    <input type="text" placeholder={search} onChange={searchsetfunction} id='serach'/>
    <button onClick={serachdbfunction}>Search</button>
    <ul>
    { searchresult.map((item,index)=> (
    <li key={index}>{item}
    <button  id={item+','+myname+',give'} onClick={giveorwithdrawrequest}>Connect</button>
    <br />
    </li>)) }
    </ul>
    <button onClick={logout}>Logout</button>
    </div>
);
}

export default Play;





































































// import { useState } from "react";
// import { io } from "socket.io-client";
// import Web from "./Web";

// function Friend(){
//     const [fsr , setfsr]  = useState({"friends":localStorage.getItem("friends").split(","),"sent":localStorage.getItem("sent").split(","),"received":localStorage.getItem("received").split(",")});
//     const [socket , setsocket] = useState(null);
//     function webweb(){
        

//         fetch("http://localhost:3205/search-look-friends",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({})})
//     .then(response => {return response.json();})
//     .then(data=> {
//         const newsocket = io('http://localhost:3205');
//         setsocket(newsocket);
//         newsocket.on("connect",()=>{console.log("Socket connected")})
//         newsocket.on("disconnect",()=> {console.log("Socket disconnected");setsocket(null);})
//     })
//     .catch(e => {alert("some error try again");})


        

//     }


//     function web(){
//         fetch("http://localhost:3205/search-look-friends",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({})})
//     .then(response => {return response.json();})
//     .then(data=> {
//         const newsocket = io('http://localhost:3205');
//         setsocket(newsocket);
//         newsocket.on("connect",()=>{console.log("Socket connected")})
//         newsocket.on("disconnect",()=> {console.log("Socket disconnected");setsocket(null);})
//     })
//     .catch(e => {alert("some error try again");})
//     }
//     function playwithfriend(e){
//         const fname = e.target.id;
//         //post req with fname
//         //check if friend online
//     }
//     return (
//         <>
//         <div>
//             <button onClick={web}>click to connect</button>
//             <h5>Your Friends List</h5>
//             {/* <ul>
//                 { fsr.friends.map((item,index)=> (
//                     <>
//                     <li key={index}>{item}</li>
//                     <button id={item} onClick={playwithfriend}>Play</button> <br />
//                     </>
//                 )) }
//             </ul> */}

//         </div>

//         <div>
//             <h5>Search for a friend</h5>
//         </div>
        
//         <div>
//             <h5>Invitations you have sent</h5>
//         </div>

//         <div>
//             <h5>Invitations you have received</h5>
//         </div>
//         </>
//     )
// }



// const sendMessage = () => {
  //   socket.emit('client-message', { text: 'Hello from client!' });
  // };

// export default Friend;



// { fsrs.friends.map((item,index)=> (
//   <li key={index}>{item} {fsrs.status[index]}
//   <button disabled = {fsrs.status[index]=='online'?false:true} onClick={gamebegins}>{fsrs.status[index]?fsrs.status[index]:"offline"}</button>
//   <br />
//   </li>)) }