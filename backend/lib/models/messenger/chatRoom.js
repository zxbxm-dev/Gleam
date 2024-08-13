module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    "ChatRoom",
    {
      roomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false, // false이면 1:1 채팅, true이면 단체 채팅
      },
      color: {
        type: DataTypes.STRING,
        allowNull: true, // 단체 채팅일 경우 색상을 지정할 수 있음
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true, // 단체 채팅일 경우 제목을 지정할 수 있음
      },
      hostUserId: {
        type: DataTypes.STRING,
        allowNull: false, // 방장 사용자
      },
      invitedUserIds: {
        type: DataTypes.JSON,
        allowNull: true, // 초대된 사용자
      },
    },
    {
      tableName: "chatRoom",
    }
  )
  return ChatRoom;
};
