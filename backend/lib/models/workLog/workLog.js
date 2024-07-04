module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
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
      team: {
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
      // 의견 작성자
      opinionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 의견 내용
      opinionContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 반려 작성자
      rejectName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 반려 내용
      rejectContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 서명 완료 갯수 진행중인 문서
      approval: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 서명 받아야 하는 총 갯수
      currentSigner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 결재 싸인 진행자
      personSigning: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 결재 진행 중
      pending: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 반려됨
      rejected: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 결재 완료
      completed: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 참조
      referName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 결재된 날짜 
      approveDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "report",
    }
  );

  return Report;
};
