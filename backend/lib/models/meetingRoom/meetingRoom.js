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
          userId: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          company: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          department: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          team: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          //회의 참가자
          Meetpeople: {
            type: DataTypes.JSON, //배열 형태로 저장
            allowNull: false,
          },
          //null값 허용
          startDate: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          endDate: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          place: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          //null값 허용
          memo: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          year: {
            type: DataTypes.STRING,
            allowNull: true,
          }
        },
        {
         tableName: "meeting"
        }
    );

    return Meeting;
}