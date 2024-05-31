const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

// modelsInitializer.js 파일에서 모델 초기화를 수행
require('./initializeModels')(sequelize, Sequelize);

module.exports = db;
