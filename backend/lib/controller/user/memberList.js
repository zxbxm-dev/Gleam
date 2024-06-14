const models = require("../../models");
const userList = models.User;

const getAllUserList = async (req, res) => {
  try {
    const users = await userList.findAll();
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;

    const userProfiles = users.map((user) => ({
      userId: user.userId,
      username: user.username,
      usermail: user.usermail,
      phoneNumber: user.phoneNumber,
      company: user.company,
      department: user.department,
      team: user.team,
      position: user.position,
      spot: user.spot,
      question1: user.question1,
      question2: user.question2,
      attachment: user.attachment ? baseUrl + user.attachment : null,
      Sign: user.Sign ? baseUrl + user.Sign : null,
      status: user.status,
      entering: user.entering,
      leavedate: user.leavedate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    console.log(attachment, Sign);

    res.json(userProfiles);
  } catch (error) {
    res.status(500).json({ error: "유저 리스트 확인 서버 오류" });
  }
};

module.exports = {
  getAllUserList,
};
