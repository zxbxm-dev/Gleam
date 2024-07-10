// module.exports = (sequelize, DataTypes) => {
//     const Attendance = sequelize.define(
//       "Attendance",
//       {
//         // 발생 날짜
//         occurrenceDate: {
//           type: DataTypes.DATE,
//           allowNull: true,
//         },
//         // 발생시간
//         occurrenceTime: {
//           type: DataTypes.TIME,
//           allowNull: true,
//         },
//         // 단말기 ID
//         terminalId: {
//           type: DataTypes.INTEGER,
//           allowNull: true,
//         },
//         // 사용자 아이디
//         userId: {
//           type: DataTypes.INTEGER,
//           allowNull: true,
//         },
//         name: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 사원번호
//         employeeNumber: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 직급
//         position: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 구분
//         category: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 모드 (출, 퇴근)
//         mode: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 인증사항
//         authentication: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//         // 결과
//         result: {
//           type: DataTypes.STRING,
//           allowNull: true,
//         },
//       },
//       {
//         tableName: "attendance",
//         timestamps: true,
//       }
//     );
  
//     return Attendance;
//   };
  

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
  
