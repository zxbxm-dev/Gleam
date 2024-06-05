const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "User",
    {
      //PK
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      usermail: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      //null값 허용
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용
      team: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용
      position: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용
      spot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      question1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      question2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      //null값 허용 (회원수정에서 증명사진 이미지 추가)
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용 (회원수정에서 싸인 이미지 추가)
      Sign: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 사용자 상태 (대기, 승인, 퇴사, 회원탈퇴 요청)
      status: {
        type: DataTypes.ENUM("pending", "approved", "left", "requested_leave"),
        allowNull: false,
        defaultValue: "pending",
      },
      // 입사 일자
      entering: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      // 퇴사 일자
      leavedate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "user",
    }
  );

  return User;
};