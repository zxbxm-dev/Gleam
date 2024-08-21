module.exports = (sequelize, DataTypes) => {
  const ChatRoomParticipant = sequelize.define(
    'ChatRoomParticipant',
    {
      roomId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'ChatRoom',
          key: 'roomId',
        },
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
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
      tableName: 'chatroom_participant',
    }
  );

  ChatRoomParticipant.associate = (models) => {

    ChatRoomParticipant.belongsTo(models.ChatRoom, {
      foreignKey: 'roomId',
      as: 'chatRoom',
    });
  };

  return ChatRoomParticipant;
};