import { useEffect, useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import io from 'socket.io-client';
const socket = io('http://localhost:3205');


function Login(){
    const nav = useNavigate();
    const [loginoutcome , setloginoutcome] = useState(false);
    useEffect(()=>{
        if(loginoutcome == true){
            nav("/search-look-friends")
        }
    },[loginoutcome])
    const [login,setlogin] = useState({"uname":"","pwd":""});




    useEffect(() => {
        socket.on("loginoutcome",data =>{
            if(data["result"]==true){
                // alert("login successful");
                //console.log(JSON.stringify(data));
                // localStorage.setItem("friends",data["friends"]);
                // localStorage.setItem("sent",data["sent"]);
                // localStorage.setItem("received",data["received"]);
                localStorage.setItem("name",data["name"]);
                setloginoutcome(true);
                  
            }
            else{
                alert("wrong login credentials");
                setloginoutcome(false);
            }
        })
        return () => {
          socket.off('server-message');
        };
      }, []);
    







    function unamechange(e){
        setlogin((previousState)=>{return {"uname":e.target.value , "pwd":previousState.pwd}})
    }
    function pwdchange(e){
        setlogin((previousState)=>{return {"uname":previousState.uname, "pwd":e.target.value }})
    }

    function toplay(){
        //console.log({... login , "type": "login"})
        socket.emit("login",login)
        
    }

    return (
        <>
        <Link to={"/sign-up"}>New to our site? Click here for sign up</Link>
        <br />
        <h3>Welcome to hangman game </h3><br />
        <h4>Enter your login credentials remember they are case sensitive</h4>
        <label htmlFor="unmae">Enter your User name</label>
        <input type="text" id="uname" placeholder={login.uname} onChange={unamechange}/>
        <label htmlFor="pwd">Enter your password</label>
        <input type="password" id="pwd" placeholder={login.pwd} onChange={pwdchange}/>
        <button onClick={toplay}>CLICK TO LOGIN</button>
        </>
    )
}

export default Login;