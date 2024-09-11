module.exports = ( sequelize, DataTypes ) => {
    const trash = sequelize.define(
        "Trash",
        {
            //PK
            Id:{
                type: DataTypes.INTEGER,
                allowNull : false,
                autoIncremetn: true,
                primaryKey: true,
            },
        }
    )
}