const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const app = express();
require('dotenv').config();
const server = http.createServer(app);
const admin = require('firebase-admin');
const io = new Server(server,{
  cors: {
    origin: '*',
    methods: ['GET' , 'POST']
  }
});


let onlinelist = [];
let PORT=process.env.PORT;
let playerstosocketid = {};

const db = require('./firebase')
const collection = db.collection("Players");

app.use(cors({
  origin: 'https://hangman-with-friends.netlify.app/', // Replace with your client's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());





 





io.on('connection', (socket) => {
  console.log('New client connected');



  socket.on("login",data =>{
    collection.where("name","==",data["uname"]).get()
  .then(d => {
    if(d.empty){
      socket.emit("loginoutcome",{"result":false})
    }
    else{
    d.forEach(val => {
      let value = val.data();
      if(value["password"]!=data["pwd"]){
        socket.emit("loginoutcome",{"result":false})
      }
      else{
        const docref = collection.doc(val.id);
        socket.emit("loginoutcome",{"result":true , "name":value["name"]})
      }
    })}
    
   
  })
  .catch(e => {
    //console.log(e);
    socket.emit("loginoutcome",{"result":false})
  })

  })


  socket.on("signup",data=>{
    let Player = {
      "name" : data["name"],
      "password" : data["pwd"],
      "friends" : [],
      "sent" : [],
      "received" : []
    }
    //onlinelist.push(request.body["uname"]);
    collection.doc(data["name"]).set(Player , {merge: false})
    .then(d => {
      socket.emit("signupoutcome","success");
    })
    .catch(e=>{socket.emit("signupoutcome","failure")})
  })

  socket.on("signupcheck",data =>{
    collection.where("name","==",data["name"]).get()
  .then(d => {
    if(d.empty){
      socket.emit("signupcheckoutcome",{"condition":true})
    }
    else{
      socket.emit("signupcheckoutcome",{"condition":true})
    }
  })
  })
  
  socket.on("giverequest",data=>{
    collection.doc(data["myname"]).update({
      "sent" : admin.firestore.FieldValue.arrayUnion(data["friendname"])
    })
    .then(()=>{
      collection.doc(data["friendname"]).update({
        "received":admin.firestore.FieldValue.arrayUnion(data["myname"])
      })
      .then(()=>{
        socket.emit("sentadded"+data["myname"],data["friendname"]);
        if(onlinelist.includes(data["friendname"])){
        io.to(playerstosocketid[data["friendname"]]).emit("receivedadded"+data["friendname"],data["myname"]);
      }
      })
      .catch(e=>{console.log("GIVE REQUEST ERROR "+e)})
    })
    .catch(e=>{console.log("GIVE REQUEST ERROR "+e)})
  })

  socket.on("enakkuokila" , data=>{
    io.to(playerstosocketid[data["friendname"]]).emit("friendkuokila"+data["friendname"], "")
  })
  socket.on("enakkuok",data=>{
    if(data["terminate"]=="yes"){
      onlinelist.filter(v => v!=data["myname"])
      onlinelist.filter(v => v!=data["friendname"])
    }
    else{
      if(onlinelist.includes(data["friendname"])){
        io.to(playerstosocketid[data["friendname"]]).emit("friendkuok"+data["friendname"],data["myname"]);
      }
      else{
        socket.emit("friendkuokila"+data["myname"],"")
      }
    }
  })

  socket.on("nametosearch",data=>{
    console.log("inside name to search"+data)
    let arraytoreturn = []
    const startterm = data["searchname"]
    const endterm = startterm.slice(0,-1) + String.fromCharCode(startterm.charCodeAt(startterm.length - 1)+ 1)
    collection.where("name",">=",startterm).where("name","<",endterm)
    .get()
    .then(d =>{
      if(!d.empty){
        d.forEach(val =>{
          let value = val.data()
          arraytoreturn.push(value["name"])
        })
        console.log("socket.on ku munnadi" + searchresu)
        socket.emit("searchresult"+data["myname"] , arraytoreturn)
        console.log("socket.on ku pinnadi")
      }
    })
  })


  socket.on("withdrawrequest",data=>{
    const myname = data["myname"];
    const friendname = data["friendname"];
    collection.doc(myname).update({
        "sent" : admin.firestore.FieldValue.arrayRemove(friendname)
    }).then(()=>{
        collection.doc(friendname).update({
            "received"  : admin.firestore.FieldValue.arrayRemove(myname)
        }).then(()=>{
            socket.emit("sentremoved"+{myname} , friendname);
            if(onlinelist.includes(friendname)){
              io.to(playerstosocketid[data["friendname"]]).emit("receivedremoved"+{friendname} , myname);}
        }).catch(e=>{console.log("WITHDRAW REQUEST ERROR "+e)})
    }).catch((e)=>{console.log("WITHDRAW REQUEST ERROR "+e)})
  })


 
  socket.on("acceptrequest",data=>{
    collection.doc(data["myname"]).update({
      "received" : admin.firestore.FieldValue.arrayRemove(data["friendname"])
    })
    .then(()=>{
      collection.doc(data["myname"]).update({
        "friends" : admin.firestore.FieldValue.arrayUnion(data["friendname"])
      })
      .then(()=>{
        collection.doc(data["friendname"]).update({
          "sent":admin.firestore.FieldValue.arrayRemove(data["myname"])
        })
        .then(()=>{
          collection.doc(data["friendname"]).update({
            "friends" : admin.firestore.FieldValue.arrayUnion(data["myname"])
          })
          .then(()=>{
            socket.emit("receivedremoved"+data["myname"],data["friendname"]);
            const stat = onlinelist.includes(data["friendname"])?"online":"offline"
            socket.emit("friendadded"+data["myname"],[stat,data["friendname"]]);
            io.to(playerstosocketid[data["friendname"]]).emit("sentremoved"+data["friendname"],data["myname"])
            io.to(playerstosocketid[data["friendname"]]).emit("friendadded"+data["friendname"],["online",data["myname"]])
          })
          .catch(e=>{console.log("ACCEPT REQUEST ERROR "+e)})
        })
        .catch(e=>{console.log("ACCEPT REQUEST ERROR "+e)})
      })
      .catch(e=>{console.log("ACCEPT REQUEST ERROR "+e)})
    })
    .catch(e=>{console.log("ACCEPT REQUEST ERROR "+e)})
  })
    
  socket.on("rejectrequest",data=>{
    collection.doc(data["myname"]).update({
      "received" : admin.firestore.FieldValue.arrayRemove(data["friendname"])
    })
    .then(()=>{
      collection.doc(data["friendname"]).update({
        "sent":admin.firestore.FieldValue.arrayRemove(data["myname"])
      })
      .then(()=>{
        socket.emit("receivedremoved"+data["myname"],data["friendname"]);
        if(onlinelist.includes(data["friendname"])){
        io.to(playerstosocketid[data["friendname"]]).emit("sentremoved"+data["friendname"],data["myname"]);}
      })
    })
    .catch(e=>{console.log("REJECT REQUEST ERROR "+e)})
  })


  socket.on("enakkureplayok",data=>{
    io.to(playerstosocketid[data["friendname"]]).emit("friendkureplayok","");
  })

  socket.on("enakkureplayokila",data=>{
    io.to(playerstosocketid[data["friendname"]]).emit("friendkureplayokila");
  })



  socket.on("inside-friends-page",data => {
    console.log(onlinelist)
    if(!onlinelist.includes(data["myname"])){
     onlinelist.push(data["myname"]);
     playerstosocketid[data["myname"]] = socket.id
    }
     //console.log(JSON.stringify(data));
     let friendstatus = {};
     let friends =[];
     let sent =[];
     let received = [];
     collection.doc(data["myname"]).get()
     .then(DOC =>{
      let dummy = DOC.data()
      friends = dummy["friends"];
      sent = dummy["sent"];
      received = dummy["received"];
      friends.forEach(key => {
        //console.log(key);
        if(onlinelist.includes(key)){
          friendstatus[key] = "online";
          console.log("friend ku send panren munnadi")
          io.to(playerstosocketid[key]).emit("statusofonefriend"+key , ["online" ,data["myname"]])
          console.log("friend ku send panren pinnadi")
      }
        else{
          console.log("else kulla")
          friendstatus[key] = "offline / in another game";
      }
       })
       console.log("enakku send panren munnadi")
       socket.emit("statusofallfriends"+data["myname"] , friendstatus)
       socket.emit("allreceived"+data["myname"],received)
       socket.emit("allsent"+data["myname"],sent)
       console.log("enakku send panren pinnadi" + JSON.stringify(friendstatus))
    
    
    })
    .catch(e => {})
     //const friends = data["friends"];
     
  })
      
      




  socket.on('client-message', (data) => {
    console.log('Message from client:', data);
    socket.emit('server-message', { response: 'Message received' });
  });
 
  socket.on("logout",data=>{
    onlinelist.filter(v => v!=data)
    playerstosocketid[data] = ""
  })
  socket.on('disconnect', () => {
  
  
    console.log('Client disconnected');
  });
  
});

server.listen(PORT, () => {
  console.log('Server is running on port ');
});











// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const httpServer = createServer();



// httpServer.listen(3205,()=>{console.log("Server is connected");});

// socket.on("connection",(socket)=>{
//     console.log(socket);
// });




//const myname = data["myname"];
    // let friendsstatusarr = {};
    // const friendsarr = data["friends"];
    // const length = friendsarr.length;
    // let count = 0;
    // collection.doc(myname).update({
    //     "status" : "online"
    // }).then(()=>{
    //     friendstatus(count , myname , friendsarr , length)
    // }).catch((e)=>{})
