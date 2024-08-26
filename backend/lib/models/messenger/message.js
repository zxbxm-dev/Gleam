module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define(
    "Message",
    {
      messageId: {
        type: DataTypes.INTEGER,
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
        references: {
          model: "ChatRoom",
          key: "roomId",
        },
        allowNull: false,
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

  Message.associate = function(models) {
    // User와 Message 간의 관계 설정
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'User'
    });
    // ChatRoom과 Message 간의 관계 설정
    Message.belongsTo(models.ChatRoom, {
      foreignKey: 'roomId',
      onDelete: 'CASCADE',
      as: 'ChatRoom'
    });
  };

  return Message;
};