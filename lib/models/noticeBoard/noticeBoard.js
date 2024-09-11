module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define(
    "Notice",
    {
      boardType: {
        type: DataTypes.STRING,
        allowNull: false,
        // 게시판을 유형에 따라 분류 (공지사항/사내규정)
        validate: {
          isIn: [["Anno", "Regul"]],
        },
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      // 첨부파일
      attachment: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      // 첨부파일 명
      pdffile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 조회수
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      // 게시글 고정
      pinned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // 게시글 고정 날짜
      pinnedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "notice",
    }
  );

  return Notice;
};
