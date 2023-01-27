const logIn = document.getElementById("logIn");
const url ="http://localhost:3000/user/login" ;

logIn.onsubmit=async(e)=>{
    try {
        e.preventDefault();
        let obj={
            email:e.target.email.value,
            password:e.target.password.value
        }
        const res = await axios.post(url,obj);
        console.log(res.data);
        giveFeed(res.data.msg,"green");
    } catch (error) {
        console.log(error);
        console.log(error.response.data.msg);
        giveFeed(error.response.data.msg);
    }
}