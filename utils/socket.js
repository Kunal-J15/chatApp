let io;
const users = {}
module.exports = {
    users,
    init: server=> {
        io = require('socket.io')(server);
        return  io;
    },
    getIo: ()=>{
        if(!io) throw new Error("Socket is not initiallize");
        return io;
    }
}