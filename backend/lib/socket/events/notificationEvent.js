const notificationHandlers = require("../handlers/notificationHandlers")

module.exports = (io, socket, connectedUsers) => {
    if(!socket) {
        console.error("Socket 객체가 정의되지 않았습니다.");
        return;
    }

//사용자에게 새로운 메세지가 전달됐을 때 
socket.on("getNewMsg",async (messageData) => {
    try{
        if(!messageData.senderId) {
            throw new Error("사용자 ID가 제공되지 않았습니다.");
        }
        await notificationHandlers.getNewMsg(socket, messageData, connectedUsers)

    }catch(error) {
        console.error("메세지알림 요청 처리 중 에러 발생 : ", error);
        socket.emit("error", { message: "메세지알림을 가져오는 중 오류가 발생했습니다."});
    }
});

//통합알람이 왔을 때 
// socket.on("getIntegratedNoti", async (smthing) => {
//     try{

//     }catch(error)
// })

};
