const signIn = document.getElementById("signIn");
signIn.onsubmit=async(e)=>{
    try {
        e.preventDefault();
    let obj= {
        name:e.target.name.value,
        email:e.target.email.value,
        password:e.target.password.value,
        number:e.target.number.value,
    }
   const res = await axios.post("/user",obj);
        giveFeed(res.data.msg,"green");
        let url = window.location.href.split("/");
        url[url.length-1] = "login.html";
        window.location = url.join("/");
    } catch (error) {
        console.log(error);
        console.log(error.response.data.msg);
        giveFeed(error.response.data.msg);
    }
    
}
