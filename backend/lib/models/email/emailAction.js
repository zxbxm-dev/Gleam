module.exports = (sequelize, DataTypes) => {
    const emailAction = sequelize.define(
        "emailAction",
        {   
            //PK
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            messageId: {
                type:DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            //user테이블 userId 외래키 설정
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                references:{
                    model : 'user',
                    key: 'userId',
                },
                ondelete: 'CASCADE',
                onupdate: 'CASCADE'
            },
            action: {
                type: DataTypes.ENUM,
                values: ['sent','sent_cancled','opened','deleted','cancled','registJunk'],
                allowNull: false,
            },
            actionTimeStamp: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
        },
        {
            tableName: "emailAction"
        }
    );
    return emailAction;
}