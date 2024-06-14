const fs = require("fs-extra");
const models = require("../../models");
const Notice = models.noticeBoard;

// ID 재정렬 함수
const reorderIds = async () => {
  const notices = await Notice.findAll({
    order: [["id", "ASC"]],
  });

  for (let i = 0; i < notices.length; i++) {
    notices[i].id = i + 1;
    await notices[i].save();
  }
};

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
      pdffile: req.file ? req.file.path : null, // 첨부 파일 경로 저장
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
    const updatedNotice = await Notice.update(
      {
        userId: userID,
        username: username,
        title: title,
        content: content,
        attachment: attachment,
        pdffile: req.file ? req.file.path : null, // 첨부 파일 경로 저장
        views: views,
        date: date,
      },
      {
        where: { id: id },
        returning: true, // 업데이트된 레코드를 반환하도록 설정
      }
    );

    console.log(`공지사항 수정: ${updatedNotice[1][0].title}`);
    // 업데이트된 행의 수 / 실제로 업데이트된 데이터 배열 형태로 반환
    res.status(200).json(updatedNotice[1][0]);
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

    // ID 재정렬
    await reorderIds();

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
      pdffile: req.file ? req.file.path : null, // 첨부 파일 경로 저장
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
    const updatedNotice = await Notice.update(
      {
        userId: userID,
        username: username,
        title: title,
        content: content,
        attachment: attachment,
        pdffile: req.file ? req.file.path : null, // 첨부 파일 경로 저장
        date: date,
      },
      {
        where: { id: id },
      }
    );

    if (updatedNotice[0] === 1) {
      res.status(200).json({ message: "규정공지 수정 완료" });
    } else {
      res
        .status(404)
        .json({ error: "해당 ID를 가진 규정공지를 찾을 수 없습니다." });
    }
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

    // ID 재정렬
    await reorderIds();

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
