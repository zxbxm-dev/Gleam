module.exports = (sequelize, DataTypes) => {
    const JunkList = sequelize.define(
        "JunkList",
        {
            //PK
            Id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            //스팸등록한 사용자
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false,
                references:{
                  model: 'user',
                  key: 'userId'
                }
            },
            //스팸등록된 주소
             junkId:{
                type: DataTypes.STRING,
                allowNull: false,
             },
             //스팸등록된 날짜
             registerAt:{
                type: DataTypes.DATE,
                allowNull: false,
             },
        },
        {
            tableName: "JunkList"
        },
    );
    return JunkList;
}