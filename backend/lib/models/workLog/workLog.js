module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    'Report',
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dept: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      selectForm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Payment: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      attachment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      pdffile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      receiptDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      sendDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      stopDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      opinionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      opinionContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rejectName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      rejectContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      approval: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 보고서 상태 (작성중, 대기중, 반려됨, 완료됨, 참조)
      status: {
        type: DataTypes.ENUM('draft', 'pending', 'rejected', 'completed', 'refer'),
        defaultValue: 'draft',
        allowNull: false,
      },
      currentSigner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: 'report',
      timestamps: true,
    }
  );

  return Report;
};
