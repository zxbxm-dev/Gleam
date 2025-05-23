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
          model: "message",
          key: "messageId",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "user",
          key: "userId",
        },
        onDelete: "CASCADE",
      },
      readAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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