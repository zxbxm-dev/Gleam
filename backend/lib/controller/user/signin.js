const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Models = require("../../models");
const User = Models.User;

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
        if (user.status === "pending") {
          return res.status(401).json({
            error: "승인 대기 중입니다. 승인 완료 후 로그인하세요.",
          });
        }

        const token = jwt.sign({ userId: user.id }, secretKey, {
          expiresIn: "1h",
        });

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

// 로그아웃
const logout = (req, res) => {
  try {
    // 클라이언트에게 로그아웃 완료 메시지 응답
    res.status(200).json({ success: "로그아웃 되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "로그아웃 서버 오류", error });
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
      res.status(200).json({
        success: "사용자를 찾았습니다.",
        username: user.username,
        userId: user.userId,
      });
    } else {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "아이디 찾기 서버 오류" });
  }
};

// 비밀번호 재설정
const resetPassword = async (req, res) => {
  const {
    userID,
    username,
    phoneNumber,
    spot,
    question1,
    question2,
    resetpassword,
  } = req.body;

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
      const hashedPassword = await bcrypt.hash(resetpassword, 10);

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

// 이미지 파일 업로드 및 회원 정보 수정을 위한 함수
const uploadDirectory = "./uploads";

//uploads 파일 없을시 생성
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

const editRegistration = async (req, res) => {
  try {
    const formData = req.body;
    const attachmentFile =
      req.files && req.files["attachment"] ? req.files["attachment"][0] : null;
    const signFile =
      req.files && req.files["sign"] ? req.files["sign"][0] : null;

    // 사용자 정보와 함께 파일 이름을 데이터베이스에 저장
    const {
      password,
      phoneNumber,
      company,
      department,
      team,
      spot,
      position,
      userID,
    } = formData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const updateData = {
      password: hashedPassword,
      phoneNumber: phoneNumber,
      company: company,
      department: department,
      team: team,
      spot: spot,
      position: position,
      attachment: attachmentFile ? attachmentFile.originalname : null,
      Sign: signFile ? signFile.originalname : null,
    };

    const [updatedRows] = await User.update(updateData, {
      where: {
        userId: userID,
      },
    });

    if (updatedRows === 0) {
      return res.status(404).send("회원 정보를 찾을 수 없습니다.");
    }

    const updatedUser = await User.findOne({ where: { userId: userID } });

    console.log("업데이트된 사용자 정보:", updatedUser);

    res.send("회원 정보가 성공적으로 수정되었습니다.");
  } catch (error) {
    console.error("회원 정보 수정 오류:", error);
    res.status(500).send("회원 정보 수정 중 오류가 발생했습니다.");
  }
};

module.exports = {
  login,
  logout,
  findUsername,
  resetPassword,
  editRegistration,
};
