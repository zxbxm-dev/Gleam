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
            //email 테이블 emailId 외래키 설정
            emailId:{
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'email',
                    key: "Id",
                },
                ondelete: 'CASCADE',
                onupdate: 'CASCADE'
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