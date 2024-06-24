// models/Attendance.js
module.exports = (sequelize, DataTypes) => {
    const Attendance = sequelize.define(
      "Attendance",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        // 발생 날짜
        occurrenceDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        // 발생시간
        occurrenceTime: {
          type: DataTypes.TIME,
          allowNull: false,
        },
        // 단말기 ID
        terminalId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        // 사용자 아이디
        userId: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
        },
        // 사원번호
        employeeNumber: {
          type: DataTypes.STRING,
        },
        // 직급
        position: {
          type: DataTypes.STRING,
        },
        // 구분
        category: {
          type: DataTypes.STRING,
        },
        // 모드 (출, 퇴근)
        mode: {
          type: DataTypes.STRING,
        },
        // 인증사항
        authentication: {
          type: DataTypes.STRING,
        },
        // 결과
        result: {
          type: DataTypes.STRING,
        },
      },
      {
        tableName: "attendance",
        timestamps: true,
      }
    );
  
    return Attendance;
  };
  