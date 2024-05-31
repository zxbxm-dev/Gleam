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
      //null값 허용 (회원수정에서 데이터 추가)
      attachment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      //null값 허용 (회원수정에서 데이터 추가)
      Sign: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      // 수정될 때마다 업데이트
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      // 사용자 상태 (대기, 승인)
      status: {
        type: DataTypes.ENUM("pending", "approved"),
        allowNull: false,
        defaultValue: "pending", // 새로 가입한 사용자의 기본 상태는 '대기'
      },
    },
    {
      tableName: "user",
    }
  );

  return User;
};
