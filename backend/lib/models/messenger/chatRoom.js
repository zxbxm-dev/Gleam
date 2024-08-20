module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    "ChatRoom",
    {
      roomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      hostUserId: { // 👻채팅방 방장 아이디
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostName: {
        type: DataTypes.STRING, // 👻채팅방 방장 이름
        allowNull: true
      },
      hostDepartment: { // 👻채팅방 방장 부서
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostTeam: { // 👻채팅방 방장 팀
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostPosition: { // 👻채팅방 방장 직위
        type: DataTypes.STRING,
        allowNull: true,
      },
      invitedUsers: { // 😎초대된 사용자 정보 (아이디, 부서, 팀, 직위 포함)
        type: DataTypes.JSON,
        allowNull: true,
      },
      title: {  // 방제목
        type: DataTypes.STRING,
        allowNull: true,
      },
      subContent: {  // 방 설명
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileColor: {  // 프로필 색상
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {  // 프로필 이미지
        type: DataTypes.STRING, // URL을 저장할 경우 STRING 타입 사용
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "chatroom",
    }
  );

  return ChatRoom;
};