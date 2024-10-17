const notificationHandlers = require("../handler/notificationHandlers");
const { getNewMsg, getUnreadMsg } = require("../handlers/statusHandlers");

module.exports = (io, socket) => {
    if(!socket) {
        console.error("Socket 객체가 정의되지 않았습니다.");
        return;
    }
};

//메세지의 sender와 receiver 의 정보를 요청하는 함수
socket.on("requestUserData", async (roomId, sender,receiver) => {
    try{
        if(!roomId) {
            throw new Error ("채팅방 ID가 제공되지 않았습니다.");
        }

        await notificationHandlers.requestUserData(socket,roomId,sender,receiver);

    }catch(error){
        console.error("메세지 수신 , 발신 사용자 정보 요청 처리 중 에러 발생")
    }
})

//사용자에게 새로운 메세지가 전달됐을 때 
socket.on("getNewMsg",async (userId) => {
    try{
        if(!userId) {
            throw new Error("사용자 ID가 제공되지 않았습니다.");
        }

        await notificationHandlers.getNewMsg(socket,userId)

    }catch(error) {
        console.error("메세지알림 요청 처리 중 에러 발생 : ", error);
        socket.emit("error", { message: "메세지알림을 가져오는 중 오류가 발생했습니다."});
    }
});

//사용자가 읽지 않은 메세지가 있을 때 
socket.on("unreadMsg",async(userId) => {
    try{
        if(!userId) {
            throw new Error ("사용자 ID가 제공되지 않았습니다.");
        }
        await notificationHandler.getUnreadMsg(socket,userId,roomId)
    }catch(error) {
        console.error("메세지알림 요청 처리 중 오류 발생: ",error);
        socket.emit("error", { message : "메세지 알림을 가져오는 중 오류가 발생했습니다."});
    }
});
