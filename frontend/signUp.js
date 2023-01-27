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
