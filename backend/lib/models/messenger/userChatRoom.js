// models/userChatRoom.js
module.exports = (sequelize, DataTypes) => {
    const UserChatRoom = sequelize.define('UserChatRoom', {
      userChatRoomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: 'User',
          key: 'userId',
        },
      },
      chatRoomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'ChatRoom',
          key: 'chatRoomId',
        },
      },
    }, {
      tableName: 'userChatRoom',
      timestamps: true,
    });
  
    return UserChatRoom;
  };
  