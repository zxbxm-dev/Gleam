module.exports = (sequelize, DataTypes) => {
    const Transfer = sequelize.define(
      "Transfer",
      {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // 새로운 부서
        Newdept: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // 새로운 직위
        Newposition: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        // 새로운 직책
        Newspot: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        // 새로운 팀
        Newteam: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        // 날짜
        date: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        // 인사이동 항목
        classify: {
            type: DataTypes.STRING,
            allowNull: true,
          },
      },
      {
        tableName: "transfer",
      }
    );
  
    return Transfer;
  };
  