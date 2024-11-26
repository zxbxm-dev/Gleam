module.exports = (sequelize, DataTypes) => {
    const docNumManagement = sequelize.define(
        "docNumManagement",
        {
        documentId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        docType: {
            type: DataTypes.STRING,
            allowNull: false,
            //문서 유형 분류 ( 팀문서 / 공용 문서)
            validate: {
                isIn: [["Team", "Public"]],
            },
        },
        team:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        docTitle: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        docNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING, 
            allowNull: false,
        },
        userposition: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        },
        {
            tableName: "docNumManagement",
            timeStamps: true,
        }
    );

    return docNumManagement; 
};