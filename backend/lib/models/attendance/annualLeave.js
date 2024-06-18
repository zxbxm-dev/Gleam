module.exports = (sequelize, DataTypes) => {
  const AnnualLeave = sequelize.define(
    "AnnualLeave",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      memo: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 연차 사용가능 일수
      availableDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usedDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 연차 잔여 일수
      extraDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 휴가 시작일
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // 휴가 종료일
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // 연차 종류
      dateType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 입사일
      entering: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // 퇴사일
      leavedate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      backgroundColor: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "annualLeave",
      timestamps: true,
    }
  );
  //User 테이블 관계 설정
  AnnualLeave.associate = (models) => {
    AnnualLeave.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
    });
  };

  return AnnualLeave;
};