axios.defaults.headers.common['Authorization'] = localStorage.getItem("token")&& JSON.parse(localStorage.getItem("token")).id;
axios.defaults.baseURL = 'http://localhost:3000';

function giveFeed(msg,color="red",time=2000) {
    const resDiv = document.getElementById("res");
    resDiv.innerText = msg;
    resDiv.style.color = color;
    setTimeout(() => {
        resDiv.innerText="";
    }, time);
}

function displayMsg(data) {
    const mesageUl = document.getElementById("messages")
    for (const msg of data) {
        const li =  document.createElement("li");
        li.className = "list-group-item list-group-item-primary";
        li.innerText = msg.msg;
        mesageUl.appendChild(li);
    }
    
}