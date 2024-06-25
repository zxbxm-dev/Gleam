const models = require("../../models");
const JobPosting = models.JobPosting;

// 채용공고 작성
const createJobPosting = async (req, res) => {
  const { title, url, site } = req.body;

  try {
    const newJobPosting = await JobPosting.create({ title, url, site });
    res.status(201).json(newJobPosting);
  } catch (error) {
    console.error("Failed to create job posting:", error);
    res.status(500).json({ error: "Failed to create job posting" });
  }
};

//

module.exports = {
  createJobPosting,
};
