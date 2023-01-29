
const chatForm =document.getElementById("chatForm");
var preData = JSON.parse(localStorage.getItem("messages"));
var preMy = JSON.parse(localStorage.getItem("myMsg"));
if(!preData) preData=[];
if(!preMy) preMy=[];
displayMsg(preData,preMy);
const intervalId = setInterval(() =>{
        loadData();
     }, 1000);

async function  loadData(params) {
    try {
        // console.log(preData,preMy);
        const messages =  await axios.get(`/message?lastId=${preData.length && preData[0].id}&&lastMy=${preMy.length && preMy[0].id}`);
        // console.log(messages.data.data[0]);
        if(messages.data.data[0].length){
            console.log("inside");
                const preLength = messages.data.data[0].length+preData.length;
                const preMyLength = messages.data.data[1].length+preMy.length
                preData =   messages.data.data[0].concat(preData.slice(0,preLength>13?preLength-messages.data.data[0].length-1:preLength));
                preMy =  messages.data.data[1].concat(preMy.slice(0,preMyLength>13?preMyLength-messages.data.data[1].length-1:preMyLength));
            console.log(preData[0],preMy);
            localStorage.setItem("messages",JSON.stringify(preData));
            localStorage.setItem("myMsg",JSON.stringify(preMy));
            displayMsg(preData,preMy);
        }

    } catch (error) {
        clearInterval(intervalId);
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