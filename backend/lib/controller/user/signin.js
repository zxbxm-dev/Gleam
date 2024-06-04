const jwt = require("jsonwebtoken");
const Models = require("../../models");
const User = Models.userData;
const bcrypt = require("bcrypt");
require('dotenv').config();

const secretKey = process.env.DB_DATABASE

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId: username } });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // JWT 토큰 생성
        const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: "1h" });

        // 사용자 정보 응답에 포함
        res.status(200).json({ 
          message: "로그인 성공",
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
            Sign: user.Sign
          }
        });
      } else {
        res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

module.exports = { login };
