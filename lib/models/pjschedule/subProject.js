module.exports = (sequelize, DataTypes) => {
    const subProject = sequelize.define(
        "subProject",
        {
        //user 테이블 userId 외래키 설정
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references:{
            model: 'user',
             key: 'userId'
            }
          },
          mainprojectIndex: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references:{
                model: 'mainProject',
                key: 'mainprojectIndex'
            }
          },
          subprojectIndex: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey : true,            
          },
          projectName: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          Leader: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        members: {
            type: DataTypes.JSON, //배열 형태로 저장
            allowNull: false,
        },
        //null 값 허용
        referrer: {
            type: DataTypes.JSON,//배열 형태로 저장
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
         //null값 허용
         memo: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          //프로젝트 상태 (시작전, 진행중, 완료)
          status: {
            type: DataTypes.ENUM("notstarted","inprogress","done"),
            allowNull: false,
            defaultValue: "notstarted",
          }
        },
        {
          tableName: "subProject"
        }
    );

    subProject.associate = (models) => {
      subProject.belongsTo(models.user, { foreignKey: 'userId'});
      subProject.belongsTo(models.mainProject, { foreignKey: 'mainprojectIndex'});
    };
    
     return subProject;
    }