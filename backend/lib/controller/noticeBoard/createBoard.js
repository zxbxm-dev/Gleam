const fs = require("fs-extra");
const models = require("../../models");
const Notice = models.Notice;

// 공지사항 작성
const writeAnnouncement = async (req, res) => {
  try {
    const { userID, username, date, title, content, views } = req.body;
    const attachment = req.file
      ? {
          fileUrl: req.file.path,
          fileName: req.file.filename,
        }
      : null;

    // 데이터베이스에 새로운 공지사항 생성
    const newNotice = await Notice.create({
      boardType: "Anno", // 공지사항 타입 지정
      userId: userID,
      username: username,
      title: title,
      content: content,
      attachment: attachment,
      pdffile: req.file ? req.file.path : null,
      views: views,
      pinned: false,
      pinnedAt: null,
      date: date,
    });

    console.log(`새로운 공지사항 작성: ${newNotice.title}`);
    res.status(201).json({
      message: "공지사항 작성이 완료되었습니다.",
      notice: newNotice,
    });
  } catch (error) {
    console.error("공지사항 작성 에러:", error);
    res.status(500).json({ error: "공지사항 작성 중 오류가 발생했습니다." });
  }
};

// 공지사항 조회수 증가
const incrementViewCount = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Notice.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: "공지사항이 없습니다." });
    }

    announcement.views += 1;
    await announcement.save();

    res.status(200).json({ message: "조회수 증가가 완료되었습니다.", views: announcement.views });
  } catch (error) {
    console.error("조회수 증가 에러", error);
    res.status(500).json({ error: "조회수 증가 중 오류가 발생했습니다." });
  }
}

// 공지사항 게시글 고정
const pinnedAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Notice.findByPk(id);

    if (!announcement) {
      return res.status(404).json({ error: "공지사항이 없습니다." });
    }

    announcement.pinned = !announcement.pinned;
    announcement.pinnedAt = announcement.pinned ? new Date() : null;
    await announcement.save();
    
    res.status(200).json({ message: "게시글 고정이 완료되었습니다."});
  } catch (error) {
    console.error("게시글 고정 에러", error);
    res.status(500).json({ error: "게시글 고정 중 오류가 발생했습니다." });
  }
}


// 공지사항 수정
const editAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID, username, date, title, content, views } = req.body;
    let attachment = null;

    if (req.file) {
      attachment = {
        fileUrl: req.file.path,
        fileName: req.file.filename,
      };

      // 기존 첨부파일 삭제
      const existingNotice = await Notice.findByPk(id);
      if (existingNotice.attachment && existingNotice.attachment.fileUrl) {
        await fs.unlink(existingNotice.attachment.fileUrl);
      }
    }

    // 데이터베이스에서 해당 공지사항을 수정
    const updatedNotice = await Notice.findByPk(id);
    
    if (!updatedNotice) {
      return res.status(404).json({ error: "해당 ID를 가진 공지사항을 찾을 수 없습니다." });
    }

    updatedNotice.userId = userID;
    updatedNotice.username = username;
    updatedNotice.title = title;
    updatedNotice.content = content;
    updatedNotice.attachment = attachment;
    updatedNotice.pdffile = req.file ? req.file.path : null;
    updatedNotice.views = views;
    updatedNotice.date = date;

    await updatedNotice.save();

    console.log(`공지사항 수정: ${updatedNotice.title}`);
    res.status(200).json(updatedNotice);
  } catch (error) {
    console.error("공지사항 수정 에러:", error);
    res.status(500).json({ error: "공지사항 수정 중 오류가 발생했습니다." });
  }
};

// 공지사항 삭제
const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    // 데이터베이스에서 해당 공지사항 찾기
    const notice = await Notice.findByPk(id);

    if (!notice) {
      return res
        .status(404)
        .json({ error: "해당 공지사항을 찾을 수 없습니다." });
    }

    // 첨부파일 삭제
    if (notice.attachment && notice.attachment.fileUrl) {
      await fs.unlink(notice.attachment.fileUrl);
    }

    // 데이터베이스에서 해당 공지사항 삭제
    await Notice.destroy({
      where: { id: id },
    });

    res.status(200).json({ message: "공지사항 삭제 완료" });
  } catch (error) {
    console.error("공지사항 삭제 에러:", error);
    res.status(500).json({ error: "공지사항 삭제 중 오류가 발생했습니다." });
  }
};

// 규정공지 작성
const writeRegulation = async (req, res) => {
  try {
    const { userID, username, date, title, content } = req.body;
    const attachment = req.file
      ? {
          fileUrl: req.file.path,
          fileName: req.file.filename,
        }
      : null;

    // 데이터베이스에 새로운 규정공지 생성
    const newNotice = await Notice.create({
      boardType: "Regul", // 공지사항 타입 지정
      userId: userID,
      username: username,
      title: title,
      content: content,
      attachment: attachment,
      pdffile: req.file ? req.file.path : null,
      date: date,
    });

    console.log(`새로운 규정공지 작성: ${newNotice.title}`);
    res.status(201).json({
      message: "규정공지 작성이 완료되었습니다.",
      notice: newNotice,
    });
  } catch (error) {
    console.error("규정공지 작성 에러:", error);
    res.status(500).json({ error: "규정공지 작성 중 오류가 발생했습니다." });
  }
};

// 규정공지 수정
const editRegulation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userID, username, date, title, content } = req.body;
    let attachment = null;
    let pdffile = null;

    if (req.file) {
      attachment = {
        fileUrl: req.file.path,
        fileName: req.file.filename,
      };

      // 기존 첨부파일 삭제
      const existingNotice = await Notice.findByPk(id);
      if (existingNotice.attachment && existingNotice.attachment.fileUrl) {
        await fs.unlink(existingNotice.attachment.fileUrl);
      }
    }

    // 데이터베이스에서 해당 규정공지를 수정
    const updatedNotice = await Notice.findByPk(id);

    if (!updatedNotice) {
      return res.status(404).json({ error: "해당 ID를 가진 규정공지를 찾을 수 없습니다." });
    }

    // 업데이트할 필드 설정
    updatedNotice.userId = userID;
    updatedNotice.username = username;
    updatedNotice.title = title;
    updatedNotice.content = content;

    // 첨부 파일 및 PDF 파일 업데이트
    if (attachment) {
      updatedNotice.attachment = attachment;
    }

    if (req.file) {
      updatedNotice.pdffile = req.file.path;
    }

    updatedNotice.date = date;

    await updatedNotice.save();

    console.log(`규정공지 수정: ${updatedNotice.title}`);
    res.status(200).json({ message: "규정공지 수정 완료" });
  } catch (error) {
    console.error("규정공지 수정 에러:", error);
    res.status(500).json({ error: "규정공지 수정 중 오류가 발생했습니다." });
  }
};

// 규정 공지 삭제
const deleteRegulation = async (req, res) => {
  try {
    const { id } = req.params;

    // 데이터베이스에서 해당 규정 공지 찾기
    const notice = await Notice.findByPk(id);

    if (!notice) {
      return res
        .status(404)
        .json({ error: "해당 규정 공지를 찾을 수 없습니다." });
    }

    // 첨부파일 삭제
    if (notice.attachment && notice.attachment.fileUrl) {
      await fs.unlink(notice.attachment.fileUrl);
    }

    // 데이터베이스에서 해당 규정 공지 삭제
    await Notice.destroy({
      where: { id: id },
    });

    res.status(200).json({ message: "규정 공지 삭제 완료" });
  } catch (error) {
    console.error("규정 공지 삭제 에러:", error);
    res.status(500).json({ error: "규정 공지 삭제 중 오류가 발생했습니다." });
  }
};

module.exports = {
  writeAnnouncement,
  incrementViewCount,
  pinnedAnnouncement,
  editAnnouncement,
  deleteAnnouncement,
  writeRegulation,
  editRegulation,
  deleteRegulation,
};