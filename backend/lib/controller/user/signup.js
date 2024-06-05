const Sequelize = require('sequelize');

const Models = require("../../models");
const signupUser = Models.userData;
const bcrypt = require("bcrypt");
// 회원가입
const createUser = async (req, res) => {
  try {
    const {
      userID,
      password,
      username,
      usermail,
      phoneNumber,
      question1,
      question2,
      company,
      department,
      team,
      position,
      spot,
      attachment,
      Sign,
      entering,
      leavedate,
    } = req.body;

    const existingUser = await signupUser.findOne({
      where: {
        [Sequelize.Op.or]: [{ userId: userID }, { usermail }, { phoneNumber }],
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "아이디, 이메일, 전화번호가 이미 존재합니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await signupUser.create({
      userId: userID,
      password: hashedPassword,
      username,
      usermail,
      phoneNumber,
      question1,
      question2,
      company,
      department,
      team,
      position,
      spot,
      attachment,
      Sign,
      entering,
      leavedate,
      status: "pending",
    });

    res.status(201).json({
      message: "회원가입이 완료되었으며, 관리자의 승인을 기다리고 있습니다.",
      user: newUser,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ message: "회원 가입 서버 오류" });
  }
};

// 모든 회원을 조회
const getAllUsers = async (req, res) => {
  try {
    const users = await signupUser.findAll();
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "회원이 없습니다." });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("회원 목록 조회 오류:", error);
    res.status(500).json({ message: "회원 목록 조회에 실패하였습니다." });
  }
};

// 회원 승인
const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await signupUser.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }

    user.status = "approved";
    await user.save();

    res.status(200).json({ message: "승인 처리가 완료되었습니다.", user });
  } catch (error) {
    console.error("회원 승인 오류:", error);
    res.status(500).json({ message: "승인 처리가 실패하였습니다." });
  }
};

// 회원 삭제
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await signupUser.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }

    await user.destroy();

    res.status(200).json({ message: "회원 삭제가 완료되었습니다." });
  } catch (error) {
    console.error("회원 삭제 오류:", error);
    res.status(500).json({ message: "회원 삭제가 실패하였습니다." });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  approveUser,
  deleteUser
};
