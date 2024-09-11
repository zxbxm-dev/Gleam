module.exports = (sequelize, DataTypes) => {
  const ChatRoomParticipant = sequelize.define(
    'ChatRoomParticipant',
    {
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ChatRoom',  // 대문자
          key: 'roomId',
        },
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      participant: { // 메신저 참여자 상태
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'chatroom_participant',  // 소문자
    }
  );
  
  ChatRoomParticipant.associate = (models) => {
    ChatRoomParticipant.belongsTo(models.ChatRoom, {
      foreignKey: 'roomId',
      as: 'chatroom',
    });
    ChatRoomParticipant.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'User',
    });
  };

  return ChatRoomParticipant;
};
