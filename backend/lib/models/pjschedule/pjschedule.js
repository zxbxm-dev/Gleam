module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define(
        "Project",
        {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        projectIndex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        projectName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //null값 허용
        subprojectName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        Leader: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        members: {
            type: DataTypes.JSON, //배열 형태로 저장
            allowNull: false,
        },
        referrer: {
            type: DataTypes.JSON,//배열 형태로 저장
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
         //null값 허용
         memo: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          //프로젝트 상태 (시작전, 진행중, 완료)
          state: {
            type: DataTypes.ENUM("notstarted","inprogress","done"),
            allowNull: false,
            defaultValue: "notstarted",
          }
        },
        {
          tableName: "project"
        }
    );

    return Project;
}