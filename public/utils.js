axios.defaults.headers.common['Authorization'] = localStorage.getItem("token") && JSON.parse(localStorage.getItem("token")).id;
axios.defaults.baseURL = 'http://localhost:3000';

function giveFeed(msg,color="red",time=2000) {
    const resDiv = document.getElementById("res");
    resDiv.innerText = msg;
    resDiv.style.color = color;
    setTimeout(() => {
        resDiv.innerText="";
    }, time);
}

function displayMsg(data=JSON.parse(localStorage.getItem("messages")),myMsg=JSON.parse(localStorage.getItem("myMsg"))) {
    const mesageUl = document.getElementById("messages");
    mesageUl.innerHTML=""
    let i=null;
    for (let k = data.length-1; k >=0 ; k--) {
        const msg = data[k];
        for (let l = 0; l <myMsg.length ; l++) {
            const my = myMsg[l];
            if(my.id===msg.id){
                i=l;
                break;
            }
        }
        if(i!=null)break
        
    }
   
    for (let j=data.length-1;j>=0;j--) {
        const msg = data[j];
        // console.log(myMsg[i].id,data[j].id);
        const li =  document.createElement("li");
        li.style.width="50%";
        // console.log(msg.createdAt,myMsg[i].createdAt);
        // console.log(msg.id,myMsg[i].id);
        if(msg.createdAt==(myMsg[i]&&myMsg[i].createdAt)){
            i--// console.log(i);
            li.className = "list-group-item list-group-item-primary mt-1 rounded-pill text-end align-self-end";
        }else li.className = "list-group-item list-group-item-secondary mt-1 rounded-pill float-start";
        
        li.innerText = msg.msg;
        const div = document.createElement("sub");
        const time = document.createTextNode(msg.createdAt+"  "+msg.sender.name);
        const br = document.createElement("br");
        div.className = "fw-lighter d-block";
        div.appendChild(time);
        li.appendChild(br)
        li.appendChild(div)
        mesageUl.appendChild(li);

    }
    
}