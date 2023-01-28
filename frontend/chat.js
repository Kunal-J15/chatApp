
const chatForm =document.getElementById("chatForm");
loadData();
async function  loadData(params) {
   const messages =  await axios.get('/message');
   console.log(messages.data.data)
   displayMsg(messages.data.data)
}
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