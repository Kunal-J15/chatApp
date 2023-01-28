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

function displayMsg(data,myMsg) {
    const mesageUl = document.getElementById("messages");
    mesageUl.innerHTML=""
    let i=0;
    for (const msg of data) {
        const li =  document.createElement("li");
        li.style.width="50%";
        if(msg.id==(myMsg[i]&&myMsg[i].id)){
            i++// console.log(i);
            li.className = "list-group-item list-group-item-primary mt-1 rounded-pill text-end align-self-end";
        }else li.className = "list-group-item list-group-item-secondary mt-1 rounded-pill float-start";
        
        li.innerText = msg.msg;
        const div = document.createElement("sub");
        const time = document.createTextNode(msg.createdAt);
        const br = document.createElement("br");
        div.className = "fw-lighter d-block";
        div.appendChild(time);
        li.appendChild(br)
        li.appendChild(div)
        mesageUl.appendChild(li);

    }
    
}