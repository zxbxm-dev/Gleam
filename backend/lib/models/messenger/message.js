module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "message",
    }
  );

  // 관계 설정
  Message.associate = (models) => {
    Message.belongsTo(models.User, { foreignKey: "userId" });
    Message.belongsTo(models.ChatRoom, { foreignKey: "roomId" });
  };

  return Message;
};