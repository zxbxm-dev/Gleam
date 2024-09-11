module.exports = (sequelize, DataTypes) => {
    const Meeting = sequelize.define(
        "Meeting",
        {
         meetingId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
         },
         username: {
            type: DataTypes.STRING,
            allowNull: false,
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
          company: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          department: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          team: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          //회의 참가자
          meetpeople: {
            type: DataTypes.JSON, //배열 형태로 저장
            allowNull: false,
          },
          startDate: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          endDate: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          startTime:{
            type: DataTypes.TIME,
            allowNull: false,
          },
          endTime:{
            type: DataTypes.TIME,
            allowNull: false,
          },
          place: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          //null값 허용
          memo: {
            type: DataTypes.STRING,
            allowNull: true,
          },
        },
        {
         tableName: "meeting"
        }
    );

    Meeting.associate = (models) => {
      Meeting.belongsTo(models.user, { foreignKey: 'userId' });
    };

    return Meeting;
}