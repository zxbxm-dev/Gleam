const initializeModels = (sequelize, Sequelize) => {

  const User = require('./user/user')(sequelize, Sequelize);
  
  // db 객체에 모델들을 추가
  const db = {};

  db.User = User;

  return db;
};

module.exports = initializeModels;
