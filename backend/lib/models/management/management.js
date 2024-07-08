module.exports = (sequelize, DataTypes) => {
    const Management = sequelize.define(
      "Management",
      {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        team: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // 부서
        dept: {
          type: DataTypes.STRING,
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
        // 근로자 명부 or 인사기록 카드 탭 네임
        TabData: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        tableName: "management",
      }
    );
  
    return Management;
  };
  