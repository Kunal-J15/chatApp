
const chatForm =document.getElementById("chatForm");
var preData;
const id = setInterval(() =>{
        loadData();
     }, 1000);

async function  loadData(params) {
    try {
        const messages =  await axios.get('/message');
   console.log(messages.data.data)
   displayMsg(messages.data.data[0],messages.data.data[1]);
    } catch (error) {
        clearInterval(id);
        console.log(error);
    }
   
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