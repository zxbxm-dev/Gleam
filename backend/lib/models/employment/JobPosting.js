module.exports = (sequelize, DataTypes) => {
    const JobPosting  = sequelize.define(
      "JobPosting ",
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.STRING(1024), //기본값(255)
          allowNull: false,
        },
        site: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "jobPosting",
        timestamps: true,
      }
    );
  
    return JobPosting ;
  };