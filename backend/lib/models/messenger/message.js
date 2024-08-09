// models/message.js
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
      messageId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      chatRoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ChatRoom',
          key: 'chatRoomId',
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId',
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      tableName: 'message',
      timestamps: true,
    });
  
    return Message;
  };
  