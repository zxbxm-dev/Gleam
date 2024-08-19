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
      hostUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invitedUserIds: {
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
        allowNull: true,  // 필수 항목이 아닐 경우 true로 설정
      },
      profileImage: {  // 프로필 이미지
        type: DataTypes.STRING, // URL을 저장할 경우 STRING 타입 사용
        allowNull: true,  // 필수 항목이 아닐 경우 true로 설정
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
      tableName: "chatRoom",
    }
  );

  return ChatRoom;
};