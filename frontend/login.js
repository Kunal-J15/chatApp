const logIn = document.getElementById("logIn");

logIn.onsubmit=async(e)=>{
    try {
        e.preventDefault();
        let obj={
            email:e.target.email.value,
            password:e.target.password.value
        }
        const res = await axios.post("/user/login",obj);
        localStorage.setItem("token",JSON.stringify(res.data));
        giveFeed(res.data.msg,"green");
        let url = window.location.href.split("/");
        url[url.length-1] = "chat.html";
        window.location = url.join("/");
    } catch (error) { 
        console.log(error);
        console.log(error.response.data.msg);
        giveFeed(error.response.data.msg);
    }
}