module.exports = (sequelize, DataTypes) => {
  const AnnualLeave = sequelize.define(
    "AnnualLeave",
    {
      username: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      availableDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      usedDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      extraDate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      StartDate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      EndDate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      DateType: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      entering: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      leavedate: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      department: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      team: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
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
