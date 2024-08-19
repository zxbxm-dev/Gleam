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
      roomId: {
        type: DataTypes.INTEGER,
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
      tableName: "message",
    }
  );
  return Message;
};
