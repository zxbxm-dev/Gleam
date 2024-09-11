module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define(
      "Attendance",
      {
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        Date: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        DataList: {
          type: DataTypes.JSON, // 배열 형태로 저장
          allowNull: true,
        },
      },
      {
        tableName: "attendance",
        timestamps: true,
      }
    );
  
    return Attendance;
  };
  
