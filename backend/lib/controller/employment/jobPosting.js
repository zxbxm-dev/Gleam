const models = require("../../models");
const JobPosting = models.JobPosting;

// 채용공고 작성
const createJobPosting = async (req, res) => {
  const { title, url, site } = req.body;

  try {
    const newJobPosting = await JobPosting.create({ title, url, site });
    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error("채용 공고를 생성하지 못했습니다.:", error);
    res.status(500).json({ error: "채용 공고를 생성 중 오류" });
  }
};

// 채용공고 목록 조회
const getAllJobPosting = async (req, res) => {
  try {
    const events = await JobPosting.findAll();
    res.status(200).json(events);
  } catch (error) {
    console.error("채용 공고 목록을 가져오지 못했습니다.:", error);
    res.status(500).json({ error: "채용 공고 목록을 가져오는중 오류" });
  }
};

// 채용공고 수정
const editJobPosting = async (req, res) => {
  const { title, url, site } = req.body;
  const { employ_id } = req.params;

  try {
    const jobPosting = await JobPosting.findByPk(employ_id);

    if (!jobPosting) {
      return res.status(404).json({ error: "채용공고를 찾을 수 없습니다." });
    }
    
    jobPosting.title = title;
    jobPosting.url = url;
    jobPosting.site = site;
    await jobPosting.save();

    res.status(200).json(jobPosting);
  } catch (error) {
    console.error("채용 공고를 업데이트하지 못했습니다.:", error);
    res.status(500).json({ error: "채용공고 수정에 실패했습니다." });
  }
};

// 채용공고 삭제
const deleteJobPosting = async (req, res) => {
  const { employ_id } = req.params;

  try {
    const jobPosting = await JobPosting.findByPk(employ_id);
    if (!jobPosting) {

      return res.status(404).json({ error: "채용공고를 찾을 수 없습니다." });
    }
    await jobPosting.destroy();

    res.status(200).json({ success: "채용공고 삭제 성공했습니다." });
  } catch (error) {
    console.error("채용 공고를 삭제하지 못했습니다.:", error);
    res.status(500).json({ error: "채용공고 삭제 실패했습니다." });
  }
};

module.exports = {
  createJobPosting,
  getAllJobPosting,
  editJobPosting,
  deleteJobPosting,
};
