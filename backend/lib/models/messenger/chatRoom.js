module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    "ChatRoom",
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
        allowNull: false, // 방장 필드
      },
      invitedUserIds: {
        type: DataTypes.JSON, // 초대받은 사용자들의 ID 배열
        allowNull: true,
      },
    },
    {
      tableName: "chatRoom",
    }
  );
  // 관계 설정
  ChatRoom.associate = (models) => {
    ChatRoom.hasMany(models.Message, { foreignKey: "roomId" });
    ChatRoom.belongsTo(models.User, { foreignKey: "hostUserId", as: "Host" }); // 방장과의 관계 설정
  };

  return ChatRoom;
};
