function Web (){
    fetch("http://localhost:3205/search-look-friends",{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify({})})
    .then(response => {return response.json();})
    .then(data=> {
        const newsocket = io('http://localhost:3205');
        setsocket(newsocket);
        newsocket.on("connect",()=>{console.log("Socket connected")})
        newsocket.on("disconnect",()=> {console.log("Socket disconnected");setsocket(null);})
    })
    .catch(e => {alert("some error try again");})

    return(
        <></>
    )
}
export default Web;