module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      content: { // 메신저 내용
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: { // 메신저를 보낸 사람
        type: DataTypes.STRING,
        allowNull: true,
      },
      roomId: { // 메신저가 속한 채팅방의 ID
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: { // 메시지 생성 시간
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: { // 메시지 업데이트 시간
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "message",
    }
  );
  return Message;
};