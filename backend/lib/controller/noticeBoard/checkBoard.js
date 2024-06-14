const models = require("../../models");
const Notice = models.noticeBoard;

// 공지사항 전체 목록 조회
const getAllAnnouncements = async (req, res) => {
    try {
      const announcements = await Notice.findAll({
        where: {
          boardType: 'Anno' // 공지사항인 경우 필터링
        }
      });
      res.status(200).json(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      res.status(500).json({ error: "Error fetching announcements" });
    }
  };
  
  // 공지사항 상세 게시글 조회
  const getAnnouncementById = async (req, res) => {
    try {
      const { id } = req.params;
      const announcement = await Notice.findOne({
        where: {
          id,
          boardType: 'Anno' // 공지사항인 경우 필터링
        }
      });
      if (announcement) {
        res.status(200).json(announcement);
      } else {
        res.status(404).json({ error: "Announcement not found" });
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      res.status(500).json({ error: "Error fetching announcement" });
    }
  };

// 사내규정 전체 목록 조회
const getAllRegulations = async (req, res) => {
  try {
    const regulations = await Notice.findAll({
      where: {
        boardType: 'Regul' // 사내규정인 경우 필터링
      }
    });
    res.status(200).json(regulations);
  } catch (error) {
    console.error("Error fetching regulations:", error);
    res.status(500).json({ error: "Error fetching regulations" });
  }
};

// 사내규정 상세 게시글 조회
const getRegulationById = async (req, res) => {
  try {
    const { id } = req.params;
    const regulation = await Notice.findOne({
      where: {
        id,
        boardType: 'Regul' // 사내규정인 경우 필터링
      }
    });
    if (regulation) {
      res.status(200).json(regulation);
    } else {
      res.status(404).json({ error: "Regulation not found" });
    }
  } catch (error) {
    console.error("Error fetching regulation:", error);
    res.status(500).json({ error: "Error fetching regulation" });
  }
};

module.exports = {
  getAllAnnouncements,
  getAnnouncementById,
  getAllRegulations,
  getRegulationById
};
