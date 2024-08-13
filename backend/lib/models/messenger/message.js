module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ChatRooms',
          key: 'roomId'
        }
      },
    },
    {
      tableName: "message",
    }
  );
  return Message;
};
