const jwt = require("jsonwebtoken");
const Models = require("../../models");
const User = Models.userData;
const bcrypt = require("bcrypt");
require("dotenv").config();

const secretKey = process.env.DB_DATABASE;

//로그인
const login = async (req, res) => {
  const { userID, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId: userID } });

    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // 사용자가 미승인 상태인 경우
        if (user.status === "pending") {
          return res.status(401).json({
            error: "승인 대기 중입니다. 승인 완료 후 로그인하세요.",
          });
        }

        // JWT 토큰 생성 (1시간)
        const token = jwt.sign({ userId: user.id }, secretKey, {
          expiresIn: "1h",
        });

        // 로그인 성공 응답
        return res.status(200).json({
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
            ques1: user.question1,
            ques2: user.question2,
            entering: user.entering,
            leaving: user.leavedate,
            status: user.status,
          },
        });
      } else {
        return res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
      }
    } else {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "로그인 서버 오류", error });
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
        phoneNumber: phoneNumber,
      },
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

// 비밀번호 재설정
const resetPassword = async (req, res) => {
  const { userID, username, phoneNumber, spot, question1, question2, resetpassword } = req.body;

  try {
    const condition = {
      userId: userID,
      username: username,
      phoneNumber: phoneNumber,
      spot: spot,
      question1: question1,
      question2: question2,
    };

    console.log("비밀번호설정 :" + condition);

    const user = await User.findOne({ where: condition });

    if (user) {
      // 새로운 비밀번호 해시 생성
      const hashedPassword = await bcrypt.hash(resetpassword, 10);

      // 사용자의 비밀번호 업데이트
      await User.update({ password: hashedPassword }, { where: condition });

      return res
        .status(200)
        .json({ success: "비밀번호가 성공적으로 재설정되었습니다." });
    } else {
      return res
        .status(404)
        .json({ error: "입력된 정보로 사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "비밀번호 재설정 서버 오류", error });
  }
};

// 회원정보 수정
const modifyMemberInfo = async (req, res) => {
  const {
    userId,
    phoneNumber,
    password,
    company,
    department,
    team,
    spot,
    attachment,
    Sign,
  } = req.body;

  try {
    // 회원 정보 업데이트
    const updatedUser = await User.update(
      {
        password: password,
        phoneNumber: phoneNumber,
        company: company,
        department: department,
        team: team,
        spot: spot,
        attachment: attachment,
        Sign: Sign,
      },
      { where: { userId: userId } }
    );

    if (updatedUser) {
      return res
        .status(200)
        .json({ success: "회원정보가 성공적으로 수정되었습니다." });
    } else {
      return res.status(404).json({ error: "회원을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "회원정보 수정 서버 오류", error });
  }
};

module.exports = {
  login,
  findUsername,
  resetPassword,
  modifyMemberInfo,
};
