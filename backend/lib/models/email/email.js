

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
            messageId: {
                type:DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
             //user 테이블 userId 외래키 설정
           userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references:{
              model: 'user',
              key: 'userId'
            }
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
            queueDate:{
                type: DataTypes.DATE,
                allowNUll: true,
            },
            //첨부파일 플래그 
            hasAttachments:{
                type: DataTypes.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },
            //명함
            signature: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            folder: {
                type:DataTypes.ENUM,
                values: ['inbox', 'sent', 'unread', 'drafts', 'junk', 'queue'],
                allowNull: false,
                defaultValue: "inbox",
            },
            star : {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            tableName: "email"
        }
    );
    return Email;
}