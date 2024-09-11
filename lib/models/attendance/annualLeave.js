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
      userId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
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
        type: DataTypes.STRING,
        allowNull: true,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      dateType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      entering: {
        type: DataTypes.DATE,
        allowNull: true,
      },
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

  return AnnualLeave;
};