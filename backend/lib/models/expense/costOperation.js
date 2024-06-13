module.exports = (sequelize, DataTypes) => {
  const Expenses = sequelize.define('Expenses', {
    team: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accountName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: "expenses",
    timestamps: true, // createdAt, updatedAt 자동 생성
  });

  return Expenses;
};
