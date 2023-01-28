
const chatForm =document.getElementById("chatForm");

chatForm.onsubmit = async(e)=>{
    try {
        e.preventDefault();
    const msg = e.target.msg.value;
    e.target.msg.value = '';
    await axios.post("/message",{text:msg});
    // giveFeed(res.data.msg,"green");

    } catch (error) {
        console.log(error.response.data.msg);
        // giveFeed(error.response.data.msg);
    }
    }