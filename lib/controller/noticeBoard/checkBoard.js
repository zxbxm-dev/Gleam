const models = require("../../models");
const Notice = models.Notice;

// 공지사항 전체 목록 조회
const getAllAnnouncements = async (req, res) => {
    try {
      const announcements = await Notice.findAll({
        where: {
          boardType: 'Anno'
        }
      });
      res.status(200).json(announcements);
    } catch (error) {
      console.error("공지사항 전체 목록 조회 중 오류가 발생했습니다.:", error);
      res.status(500).json({ error: "공지사항 전체 목록 조회 서버 오류" });
    }
  };
  
  // 공지사항 상세 게시글 조회
  const getAnnouncementById = async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await Notice.findOne({
        where: {
          id,
          boardType: 'Anno'
        }
      });
      if (announcement) {
        res.status(200).json(announcement);
      } else {
        res.status(404).json({ error: "해당 상세공지 사항을 찾을 수 없습니다." });
      }
    } catch (error) {
      console.error("공지사항 상세 조회 중 오류가 발생했습니다.:", error);
      res.status(500).json({ error: "상세공지 사항 조회 서버 오류" });
    }
  };

// 사내규정 전체 목록 조회
const getAllRegulations = async (req, res) => {
  try {
    const regulations = await Notice.findAll({
      where: {
        boardType: 'Regul'
      }
    });
    res.status(200).json(regulations);
  } catch (error) {
    console.error("사내규정 전체 목록 조회 중 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "사내규정 전체 목록 조회 서버 오류" });
  }
};

// 사내규정 상세 게시글 조회
const getRegulationById = async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await Notice.findOne({
      where: {
        id,
        boardType: 'Regul'
      }
    });
    if (regulation) {
      res.status(200).json(regulation);
    } else {
      res.status(404).json({ error: "해당 사내규정 사항을 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("사내규정 상세 조회 중 오류가 발생했습니다.:", error);
    res.status(500).json({ error: "사내규정 상세 조회 서버 오류" });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  getAllRegulations,
  getRegulationById
};
