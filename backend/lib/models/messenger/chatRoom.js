module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    'ChatRoom',
    {
      roomId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      isGroup: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isSelfChat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      hostUserId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hostName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hostDepartment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostTeam: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hostPosition: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      userTitle: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      subContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profileImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'chatroom',  // 소문자
      timestamps: false,
    }
  );

  ChatRoom.associate = (models) => {
    ChatRoom.hasMany(models.ChatRoomParticipant, {
      foreignKey: 'roomId',
      as: 'ChatRoomParticipants',  // 대문자
    });

    ChatRoom.hasMany(models.Message, {
      foreignKey: 'roomId',
      as: 'ChatRoomMessages',  // 대문자
    });
  };

  return ChatRoom;
};
