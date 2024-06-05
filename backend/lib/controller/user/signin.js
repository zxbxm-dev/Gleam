const jwt = require("jsonwebtoken");
const Models = require("../../models");
const User = Models.userData;
const bcrypt = require("bcrypt");
require('dotenv').config();

const secretKey = process.env.DB_DATABASE

//로그인
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId: username } });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // JWT 토큰 생성 (1시간)
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

        // 사용자 정보 응답에 포함
        res.status(200).json({ 
          success: "로그인 성공",
          loggedIn: true,
          token,
          user: {
            username: user.username,
            userId: user.userId,
            usermail: user.usermail,
            phoneNumber: user.phoneNumber,
            company: user.company,
            department: user.department,
            team: user.team,
            position: user.position,
            spot: user.spot,
            attachment: user.attachment,
            Sign: user.Sign,
            ques1:user.question1,
            ques2 :user.question2,
            entering:user.entering,
            leaving:user.leavedate,
          }
        });
      } else {
        res.status(401).json({ loggedIn: false, error: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      res.status(404).json({ loggedIn: false, error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ loggedIn: false, message: "로그인 서버 오류", error});
  }
};

// 아이디 찾기
const findUsername = async (req, res) => {
  const { username, spot, phoneNumber } = req.body;

  try {
    const user = await User.findOne({ 
      where: { 
        username: username,
        spot: spot,
        phoneNumber: phoneNumber
      } 
    });

    if (user) {
      // 사용자를 찾은 경우
      res.status(200).json({ 
        success: "사용자를 찾았습니다.",
        username: user.username,
        userId: user.userId,
      });
    } else {
      // 사용자를 찾지 못한 경우
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "아이디 찾기 서버 오류" });
  }
};

module.exports = { 
  login,
  findUsername
};
