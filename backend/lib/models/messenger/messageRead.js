module.exports = (sequelize, DataTypes) => {
  const MessageRead = sequelize.define(
    "MessageRead",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      messageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Message",
          key: "messageId",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "messageRead",
    }
  );

  MessageRead.associate = (models) => {
    MessageRead.belongsTo(models.Message, {
      foreignKey: "messageId",
      as: "message",
      onDelete: "CASCADE",
    });
    MessageRead.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE",
    });
  };

  return MessageRead;
};