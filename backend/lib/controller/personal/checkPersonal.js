const models = require("../../models");
const User = models.User;

const getAllPersonal = async (req, res) => {
  try {
    const personnelInquiry = await User.findAll();
    res.status(200).json(personnelInquiry);
  } catch (error) {
    console.error("인사정보관리 조회 중 오류 발생:", error);
    res.status(500).json({ error: "서버 오류 - 인사정보 조회 실패" });
  }
};

module.exports = {
  getAllPersonal
};
