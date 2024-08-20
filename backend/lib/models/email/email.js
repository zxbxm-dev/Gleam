module.exports = (sequelize, DataTypes) => {
    const Email = sequelize.define(
        "Email",
        {
            //PK
            Id:{
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true, 
                primaryKey: true,
            },
             sender: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            receiver: {
                type: DataTypes.JSON, //배열형태로 저장
                allowNull: false,
            },
            //null 값 허용
            referrer: {
                type: DataTypes.JSON, //배열 형태로 저장
                allowNull: true,
            },
            subject: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            //null 값 허용
            body: {
                type: DataTypes.TEXT,
                allowNull : true,
            },
            //null 값 허용
            sendAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            //null 값 허용
            receiveAt: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            //명함
            signature: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            folder: {
                type:DataTypes.ENUM,
                values: ['inbox', 'sent', 'starred', 'unread', 'drafts', 'junk'],
                allowNull: false,
                defaultValue: "inbox",
            }
        },
        {
            tableName: "email"
        }
    );
    return Email;
}