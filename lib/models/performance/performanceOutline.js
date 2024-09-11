module.exports = ( sequelize, DataTypes ) => {
    const evalOutline = sequelize.define(
        "evalOutline",
        {
            file: {
                type: DataTypes.STRING,
                allowNull: true
               },
               fileName: {
                type: DataTypes.STRING,
                allowNull: true,
               },
            },
            {
                tableName: "evalOutline"
            }
    );
    return evalOutline;
}