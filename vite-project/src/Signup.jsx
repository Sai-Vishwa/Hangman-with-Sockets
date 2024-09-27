import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from 'socket.io-client';
const socket = io('http://localhost:3205');

function Signup(){
    const [signup,setsignup] = useState({"uname":"","pwd":""})
    const [pwdenable,setpwdenable] = useState(true);
    const [unameenable,setunameenable] = useState(false);
    const [ispwdok , setispwdok] = useState("");
    const nav = useNavigate();

    useEffect(() => {
        socket.on("signupcheckoutcome",data =>{
            if(data["condition"]==true){
                alert("You can use this username");
                setpwdenable(false);
                setunameenable(true);
          }
          else{
              alert("Username already taken");
          }
        })

        socket.on("signupoutcome",data =>{
            alert("Sign up Successful");
            localStorage.setItem("name",signup.uname);
            // localStorage.setItem("friends","");
            // localStorage.setItem("sent","");
            // localStorage.setItem("received","");
            nav("/search-look-friends");
        })
        return () => {
          socket.off('server-message');
        };
      }, []);

    useEffect(()=>{
        const digitRegex = /\d/;    
        if(signup.pwd.length<7 || !digitRegex.test(signup.pwd)){
            setispwdok("Password will not be accepted")
        }
        else{
            setispwdok("Password ok!!!")
        }
    },[signup.pwd])
    function checkusername(){

        socket.emit("signupcheck",{"name":signup.uname});
    }
    function setuname(e){
        setsignup((previousState)=>{return ({"uname":e.target.value , "pwd" : previousState.pwd})})
    }
    function setpwd(e){
        setsignup((previousState)=>{return ({"uname":previousState.uname,"pwd":e.target.value})})
    }

    function signupbtn(){
        if(unameenable == false || ispwdok!="Password ok!!!"){
            alert("Invalid signup event")
        }
        else{
            socket.emit("signup",{"name":signup.uname,"pwd" : signup.pwd})
        }
    }

    return (
        <>
        <h3>Welcome to Hangman</h3>
        <h4>Enter your user name remember it must be unique and already taken values cannot be accepted</h4>
        <label htmlFor="uname">Enter the user name here - </label>
        <input type="text" id="uname" placeholder={signup.uname} onChange={setuname} disabled={unameenable}/>
        <button onClick={checkusername}>Click to verify</button><br />
        <h6>Entered password must be 7 letters long and must have atleast 1 number</h6><br />
        <label htmlFor="pwd" >Enter Password</label>
        <input type="password" id="pwd" onChange={setpwd} placeholder={signup.pwd} disabled = {pwdenable} />
        <p>{ispwdok}</p>
        <button onClick={signupbtn}>Sign-Up</button>
        </>
    )
}
export default Signup;