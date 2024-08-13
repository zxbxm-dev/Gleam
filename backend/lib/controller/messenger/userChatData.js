const models = require("../../models");
const userData = models.User;

const createUser = async (req, res) => {
  try {
    const user = await userData.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userData.findOne({ where: { userId: req.params.userId } });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "유저의 정보를 찾지 못하였습니다." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createUser, getUser };
