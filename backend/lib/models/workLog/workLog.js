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
      // 서명 갯수?????/
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
      // 진행 중인 결재자
      // 사용할지 모르겠지만.... 진행 중인 결재자 나타내는 컬럼
      // 예를 들어 1번 결제자가 완료하면 2번 결제자로 넘어가고.... 이렇게 3번 4번까지
      // 결제 상태를 나타내는 컬럼 입니다.
      // index id 번호를 받아 처리하도록...
      currentSigner: {
        type: DataTypes.STRING,
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
