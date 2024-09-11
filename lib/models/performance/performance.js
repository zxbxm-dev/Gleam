module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define(
    "Evaluation",
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      team: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      files: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
          const files = this.getDataValue("files");
          return files ? JSON.parse(files) : [];
        },
        set(files) {
          this.setDataValue("files", JSON.stringify(files));
        },
      },
      filename: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // 퇴사자 상태
      isFormerEmployee: {
        type: DataTypes.BOOLEAN,
        defaultValue: false, // 기본값으로 false (퇴사자의 경우 true로 변경)
        allowNull: false,
      },
    },
    {
      tableName: "evaluations",
      timestamps: true,
    }
  );

  return Evaluation;
};
