const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const Models = require("../../models");
const signupUser = Models.User;
const quitter = Models.Quitter;
const axios = require('axios');
require('dotenv').config();

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
      success: "회원가입이 완료되었으며, 관리자의 승인을 기다리고 있습니다.",
      user: newUser,
    });
  } catch (error) {
    console.error("회원가입 오류:", error);
    res.status(500).json({ error: "회원 가입 서버 오류" });
  }
};

//아이디 중복 확인
const checkDuplicate = async (req, res) => {
  try {
    const { userID } = req.body;

    const existingUser = await signupUser.findOne({
      where: {
        [Sequelize.Op.or]: [{ userId: userID }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "아이디가 이미 존재합니다." });
    }

    res.status(200).json({ success: "사용 가능한 아이디 입니다." });
  } catch (error) {
    console.error("중복 체크 오류:", error);
    res.status(500).json({ error: "중복 체크 서버 오류" });
  }
};

// 모든 회원을 조회
const getAllUsers = async (req, res) => {
  try {
    const users = await signupUser.findAll();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "회원이 없습니다." });
    }
    console.log(users);

    res
      .status(200)
      .json({ success: "회원 목록 조회가 완료되었습니다.", users });
  } catch (error) {
    console.error("회원 목록 조회 오류:", error);
    res.status(500).json({ error: "회원 목록 조회에 실패하였습니다." });
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
    
    const mailcowAddAccount = await axios.post('http://119.193.90.123:8080/api/v1/add/mailbox',
      {
        "local_part": user.userId,
        "domain": "gleam.im",
        "name": user.username,
        "quota": "0",
        "password": "math123!!",
        "password2": "math123!!",
        "active": "1",
        "force_pw_update": "0",
        "tls_enforce_in": "0",
        "tls_enforce_out": "0"
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.Mail_API
        }
      }
    );

    const mailcowAddSyncjob = await axios.post('http://119.193.90.123:8080/api/v1/add/syncjob',
    {
      "username": `${user.userId}@gleam.im`,
      "host1":"mail.gleam.im",
      "port1":"993",
      "user1":user.userId,
      "password1":"math123!!",
      "enc1":"SSL",
      "mins_interval":"20",
      "subfolder2":"External",
      "maxage":"0",
      "maxbytespersecond":"0",
      "timeout1":"600",
      "timeout2":"600",
      "exclude":"(?i)spam|(?i)junk",
      "custom_params":"",
      "delete2duplicates":"1",
      "delete1":"1",
      "delete2":"0",
      "automap":"1",
      "skipcrossduplicates":"0",
      "subscribeall":"1",
      "active":"1",

    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.Mail_API
      }

    }
  );

    console.log('Mailbox created:', mailcowAddAccount.data);
    console.log('Syncjob success:', mailcowAddSyncjob.data);

    res.status(200).json({ success: "승인 처리가 완료되었습니다.", user });
  } catch (error) {
    console.error("회원 승인 오류:", error);
    res.status(500).json({ error: "승인 처리가 실패하였습니다." });
  }
};

// 회원 승인 거절
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await signupUser.findOne({ where: { userId } });

    if (!user) {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }

    await user.destroy();

    res.status(200).json({ success: "회원 승인 거절이 완료되었습니다." });
  } catch (error) {
    console.error("회원 삭제 오류:", error);
    res.status(500).json({ error: "회원 승인 거절이 실패하였습니다." });
  }
};

// 회원 탈퇴 (퇴사자 유저)
const userleaves = async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await signupUser.findOne({ where: { userID } });

    if (!user) {
      return res.status(404).json({ message: "회원 정보가 없습니다." });
    }

    // 탈퇴한 회원을 다른 DB에 추가
    await quitter.create({
      userId: user.userId,
      password: user.password,
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
      attachment: user.attachment,
      Sign: user.Sign,
      status: "quitter", // 탈퇴 상태로 설정
      entering: user.entering,
      leavedate: new Date(), // 현재 날짜로 퇴사일 설정
    });

    // 회원 데이터베이스에서 삭제
    await signupUser.destroy({ where: { userID } });

    const mailcowDelAccount = await axios.post('http://119.193.90.123:8080/api/v1/delete/mailbox',
      [
        `${userID}@gleam.im`,
      ],
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.Mail_API
        }
      }
    );
    const mailcowDelSyncjob = await axios.post('http://119.193.90.123:8080/api/v1/delete/syncjob',[

    ],
    {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.Mail_API
      }
    })

    console.log('Mailbox deleted:', mailcowDelAccount.data);
    console.log('Syncjob deleted:', mailcowDelSyncjob.data);

    return res
      .status(200)
      .json({ success: "회원 탈퇴 요청이 완료되었습니다." });
  } catch (error) {
    console.error("회원 탈퇴 요청 오류:", error);
    return res.status(500).json({ error: "회원 탈퇴 요청이 실패하였습니다." });
  }
};

module.exports = {
  createUser,
  checkDuplicate,
  getAllUsers,
  approveUser,
  deleteUser,
  userleaves,
};
