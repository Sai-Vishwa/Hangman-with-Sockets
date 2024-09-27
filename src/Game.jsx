import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io('http://localhost:3205');


function Game(){
    const [sentenceandhint , setsentenceandhint] = useState({"sentence":localStorage.getItem("sentence") , "hint":localStorage.getItem("hint")})
    const [sentence , setsentence] = useState("".concat(sentenceandhint.sentence).replaceAll(","," "))
    const [sentenceandbuttontoprint , setsentenceandbuttontoprint] = useState({"sentence":"","A":["white","black"],"B":["white","black"],"C":["white","black"],"D":["white","black"],"E":["white","black"],"F":["white","black"],"G":["white","black"],"H":["white","black"],"I":["white","black"],"J":["white","black"],"K":["white","black"],"L":["white","black"],"M":["white","black"],"N":["white","black"],"O":["white","black"],"P":["white","black"],"Q":["white","black"],"R":["white","black"],"S":["white","black"],"T":["white","black"],"U":["white","black"],"V":["white","black"],"W":["white","black"],"X":["white","black"],"Y":["white","black"],"Z":["white","black"],"errorsleft":5 , "answerfound":false});
    const [replay , setreplay] = useState({"enakku":"notyetdecided","friendku":"notyetdecided"})
    let enakkureplayok = "notyetdecided";
    let friendkureplayok = "notyetdecided";
    const nav = useNavigate();
    for(let i =0 ; i<sentence.length ; i++){
        if(sentence.charAt(i)==" "){
            setsentencetoprint((previousState)=>{return(previousState.concat("  "))})
        }
        else{
            setsentencetoprint((previousState)=>{return(previousState.concat("_ "))})
    }}
    

    
    
    function buttonfunc(e){
        const val = e.target.id;
        let dummy="";
        for(let i=0;i<sentence.length;i++){
            if(sentence.charAt[i]==" "){
                dummy.concat("  ");
            }
            else if(sentence.charAt[i]==val){
                dummy.concat(val+" ");
            }
            else{
                dummy.concat("_ ");
            }
        }
        if(dummy == sentencetoprint){
            let dummy2 = sentenceandbuttontoprint;
            dummy2[val] = ["black","white"];
            dummy2.errorsleft= dummy2.errorsleft-1;
            if(dummy2.errorsleft == 0){
                alert("no more attempts ... you lost ... btw the sentence was - "+{sentence});
                let confirm = window.confirm("wanna play again");
                if(confirm){
                    if(replay.friendku == "okila"){alert("friend rejected");nav("/search-look-friends");}
                    else if(replay.friendku == "ok"){alert("new challenge begins");replaygame();}
                    else{socket.emit("enakkureplayok",{"myname":localStorage.getItem("name"),"friendname":localStorage.getItem("gamefriendname")});
                    setreplay((previousState)=>{return({"enakku":"ok","friendku":previousState.friendku})})}
                }
                else{
                    if(replay.friendku == "notyetdecided"){
                    socket.emit("enakkureplayokila",localStorage.getItem("name"));}
                    nav("/search-look-friends")
                }
            }
            setsentenceandbuttontoprint(dummy2)
        }
        else{
            let dummy3 = sentenceandbuttontoprint;
            dummy3[val] = ["green","white"];
            dummy3["sentence"]=dummy;
            if(!dummy.includes("_")){
                alert("you successfully found the sentence")
                let confirm = window.confirm("wanna play again");
                if(confirm){
                    if(replay.friendku == "okila"){alert("friend rejected");nav("/search-look-friends");}
                    else if(replay.friendku == "ok"){alert("new challenge begins");replaygame();}
                    else{socket.emit("enakkureplayok",{"myname":localStorage.getItem("name"),"friendname":localStorage.getItem("gamefriendname")});
                        setreplay((previousState)=>{return({"enakku":"ok","friendku":previousState.friendku})})}
                }
                else{
                    if(replay.friendku == "notyetdecided"){
                    socket.emit("enakkureplayokila",localStorage.getItem("name"));}
                    nav("/search-look-friends")
                }
            }
            setsentenceandbuttontoprint(dummy3)
        }
    }
    
    useEffect(()=>{
        socket.on("friendkureplayok",data=>{
            if(replay.enakku == "ok"){alert("both of you said ok...starting new game");replaygame()}
            setreplay((previousState)=>{return ({"enakku":previousState.enakku , "friendku":"ok"})})
        })
        socket.on("friendkureplayokila",data=>{
            alert("your friend dont wanna play again with u");
            setreplay((previousState)=>{return ({"enakku":previousState.enakku , "friendku":"okila"})})
        })
    },[])


    return (<>
            <h3>Word to find - </h3><br />
            <h3>{sentencetoprint}</h3>
            <button id='Q' disabled={buttonpressed["Q"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["Q"][0], color:buttonpressed["Q"][1]}} onClick={buttonfunc}>Q</button>
            <button id='w' disabled={buttonpressed["W"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["W"][0], color:buttonpressed["W"][1]}} onClick={buttonfunc}>W</button>
            <button id='E' disabled={buttonpressed["E"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["E"][0], color:buttonpressed["E"][1]}} onClick={buttonfunc}>E</button>
            <button id='R' disabled={buttonpressed["R"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["R"][0], color:buttonpressed["R"][1]}} onClick={buttonfunc}>R</button>
            <button id='T' disabled={buttonpressed["T"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["T"][0], color:buttonpressed["T"][1]}} onClick={buttonfunc}>T</button>
            <button id='Y' disabled={buttonpressed["Y"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["Y"][0], color:buttonpressed["Y"][1]}} onClick={buttonfunc}>Y</button>
            <button id='U' disabled={buttonpressed["U"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["U"][0], color:buttonpressed["U"][1]}} onClick={buttonfunc}>U</button>
            <button id='I' disabled={buttonpressed["I"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["I"][0], color:buttonpressed["I"][1]}} onClick={buttonfunc}>I</button>
            <button id='O' disabled={buttonpressed["O"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["O"][0], color:buttonpressed["O"][1]}} onClick={buttonfunc}>O</button>
            <button id='P' disabled={buttonpressed["P"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["P"][0], color:buttonpressed["P"][1]}} onClick={buttonfunc}>P</button>
            <br />
            <button id='A' disabled={buttonpressed["A"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["A"][0], color:buttonpressed["A"][1]}} onClick={buttonfunc}>A</button>
            <button id='S' disabled={buttonpressed["S"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["S"][0], color:buttonpressed["S"][1]}} onClick={buttonfunc}>S</button>
            <button id='D' disabled={buttonpressed["D"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["D"][0], color:buttonpressed["D"][1]}} onClick={buttonfunc}>D</button>
            <button id='F' disabled={buttonpressed["F"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["F"][0], color:buttonpressed["F"][1]}} onClick={buttonfunc}>F</button>
            <button id='G' disabled={buttonpressed["G"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["G"][0], color:buttonpressed["G"][1]}} onClick={buttonfunc}>G</button>
            <button id='H' disabled={buttonpressed["H"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["H"][0], color:buttonpressed["H"][1]}} onClick={buttonfunc}>H</button>
            <button id='J' disabled={buttonpressed["J"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["J"][0], color:buttonpressed["J"][1]}} onClick={buttonfunc}>J</button>
            <button id='K' disabled={buttonpressed["K"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["K"][0], color:buttonpressed["K"][1]}} onClick={buttonfunc}>K</button>
            <button id='L' disabled={buttonpressed["L"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["L"][0], color:buttonpressed["L"][1]}} onClick={buttonfunc}>L</button>
            <br />
            <button id='Z' disabled={buttonpressed["Z"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["Z"][0], color:buttonpressed["Z"][1]}} onClick={buttonfunc}>Z</button>
            <button id='X' disabled={buttonpressed["X"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["X"][0], color:buttonpressed["X"][1]}} onClick={buttonfunc}>X</button>
            <button id='C' disabled={buttonpressed["C"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["C"][0], color:buttonpressed["C"][1]}} onClick={buttonfunc}>C</button>
            <button id='V' disabled={buttonpressed["V"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["V"][0], color:buttonpressed["V"][1]}} onClick={buttonfunc}>V</button>
            <button id='B' disabled={buttonpressed["B"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["B"][0], color:buttonpressed["B"][1]}} onClick={buttonfunc}>B</button>
            <button id='N' disabled={buttonpressed["N"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["N"][0], color:buttonpressed["N"][1]}} onClick={buttonfunc}>N</button>
            <button id='M' disabled={buttonpressed["M"]==["white","black"]?false:true} style={{backgroundColor: buttonpressed["M"][0], color:buttonpressed["M"][1]}} onClick={buttonfunc}>M</button>
            <br />
            <h6>Hint - {sentenceandhint.hint}</h6>
            <h6>Mistakes left - {gamecompleted.errorsleft}</h6>
    </>)
}

export default Game;