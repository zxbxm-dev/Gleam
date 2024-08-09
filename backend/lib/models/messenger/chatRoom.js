// models/chatRoom.js
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('ChatRoom', {
      chatRoomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('1:1', '1:N', 'N:N'),
        allowNull: false,
      },
    }, {
      tableName: 'chatRoom',
      timestamps: true,
    });
  
    return ChatRoom;
  };  