const models = require("../../models");
const userList = models.userData;

//유저 정보 리스트 전달
const getAllUserList = async (req, res) => {
  try {
    const users = await userList.findAll();
    //이미지 업로드 디렉토리의 경로
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
    //배열로 반환
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

    res.json(userProfiles);
  } catch (error) {
    console.error("유저 정보를 가져오는 중에 오류가 발생했습니다.:", error.message);
    console.error(error.stack);
    res
      .status(500)
      .json({ error: "유저 리스트 확인 서버 오류", details: error.message });
  }
};

module.exports = {
  getAllUserList,
};
