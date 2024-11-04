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
      receiverId:{
        type: DataTypes.STRING,
        allowNull: false,
      },
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: "chatroom",
          key: "roomId",
        },
        allowNull: false,
      },
      filePath: {
        type: DataTypes.STRING,
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
      contentType:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "text",
      }
      ,
    },
    {
      tableName: "message",
    }
  );

  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
      as: 'user',
    });
    Message.belongsTo(models.ChatRoom, {
      foreignKey: 'roomId',
      onDelete: 'CASCADE',
      as: 'chatRoom',
    });
  };

  return Message;
};
