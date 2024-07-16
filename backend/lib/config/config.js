require('dotenv').config(); // .env 파일에서 환경 변수 로드

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+09:00'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+09:00' //한국시간
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+09:00'
  }
};
