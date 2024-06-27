module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define(
    "Report",
    {
      // 유저 아이디
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 유저이름
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 부서
      dept: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 직책
      currentSigner: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 보고서 양식
      selectForm: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 결제라인 및 참조
      Payment: {
        type: DataTypes.JSON, // 데이터 형식을 JSON으로 변경
        allowNull: true,
      },
      // 보고서 제출 파일
      attachment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      // 보고서 파일 명
      pdffile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 수신 날짜
      receiptDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // 발신 날짜
      sendDate: {
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
      // 보고서 반려
      rejectName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 보고서 반려 사유
      rejectContent: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 서명 완료 갯수 진행중인 문서
      approval: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // 보고서 상태 (작성중, 대기중, 반려됨, 완료됨)
      status: {
        type: DataTypes.ENUM("draft", "pending", "rejected", "completed"),
        defaultValue: "draft", // 기본값 설정
        allowNull: false,
      },
      // 서명 받아야 하는 총 갯수
      currentSigner: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "report",
      timestamps: true,
    }
  );

  return Report;
};
