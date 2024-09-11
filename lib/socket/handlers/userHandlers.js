const models = require('../../models');
const User = models.User;

// 사용자 정보를 조회하는 함수
const getUserDetails = async (userId) => {
  try {
    return await User.findOne({ where: { userId } });
  } catch (error) {
    console.error('사용자 조회 오류:', error);
    throw new Error('사용자 조회 오류');
  }
};

module.exports = {
  getUserDetails
};
