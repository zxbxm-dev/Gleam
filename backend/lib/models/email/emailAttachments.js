

module.exports = (sequelize, DataTypes) => {
    const EmailAttachment = sequelize.define(
        "EmailAttachment",
        {
            //PK
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true, 
                primaryKey: true,
            },
            //email 테이블 emailId 외래키 설정
            emailId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references:{
                    model: 'email',
                    key: "Id",
                },
                ondelete: 'CASCADE',
                onupdate: 'CASCADE'
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            mimeType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    isIn: [['file', 'image', 'video', 'audio', 'link', 'text']],
                },
            },
            fileSize: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fileData: {
                type: DataTypes.BLOB('long'),
                allowNull: true, // 파일이 아닌 경우에는 null 가능
            },
            url: {
                type: DataTypes.STRING,
                allowNull: true, // 링크 타입을 위한 필드
            },
            textContent: {
                type: DataTypes.TEXT,
                allowNull: true, // 텍스트 데이터를 위한 필드
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            tableName: "emailAttachment"
        }
    );
    return EmailAttachment;
}