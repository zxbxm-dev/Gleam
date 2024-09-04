
//삭제 예정 





module.exports = (sequelize, DataTypes) => {
    const emailQueue = sequelize.define(
        'emailQueue',
        {
            //PK
            Id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true, 
                primaryKey: true,
            },
             //user테이블 userId 외래키 설정
             sender: {
                type: DataTypes.STRING,
                allowNull: false,
                references:{
                    model : 'user',
                    key: 'userId',
                },
                ondelete: 'CASCADE',
                onupdate: 'CASCADE'
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
            sendAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            signature: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            folder: {
                type:DataTypes.STRING,
                allowNull: false,
                defaultValue: "queue",
            },
        },
        {
            tableName: 'emailQueue'
        }
    );
    return emailQueue;
}