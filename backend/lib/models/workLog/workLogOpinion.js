module.exports = (sequelize, DataTypes) => {
    const ReportOpinion = sequelize.define(
        "ReportOpinion",
        {
            opinionId : {
                type: DataTypes.INTEGER,
                alloNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            reportId : {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'Report',
                    key: 'id',
                },
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            assignPosition: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            //null값 허용
            content: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            type: {
                type: DataTypes.ENUM('opinion','rejection','canclellation'),
                allowNull: false,
                defaultValue: 'opinion',
            }
        },
        {
            tableName: "reportOpinion",
        }
    );

    return ReportOpinion;
};