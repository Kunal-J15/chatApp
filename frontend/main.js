const signIn = document.getElementById("signIn");
const url ="http://localhost:3000/user/" ;
signIn.onsubmit=async(e)=>{
    try {
        e.preventDefault();
    let obj= {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value,
        number:e.target.number.value,
    }
   const res = await axios.post(url,obj);
        giveFeed(res.data.msg,"green");
    } catch (error) {
        console.log(error);
        console.log(error.response.data.msg);
        giveFeed(error.response.data.msg);
    }
    
}

function giveFeed(msg,color="red",time=2000) {
    const resDiv = document.getElementById("res");
    resDiv.innerText = msg;
    resDiv.style.color = color;
    setTimeout(() => {
        resDiv.innerText="";
    }, time);
}