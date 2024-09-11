const models = require("../../models");
const evalOutline = models.evalOutline

//인사평가 개요 파일 업로드
const uploadEvalOutline = async (req, res) => {
    try {
        const { file, fileName } = req.file ? {
            file: req.file.path,
            fileName: req.file.filename,
        } : { file: null, fileName: null };

        console.log("인사평가 개요 파일: ", file, fileName);

        // 모든 기존 인사평가 개요 파일 삭제
        await evalOutline.destroy({ where: {} });
        console.log('기존 파일 모두 삭제 성공');

        // 새 파일 저장
        const uploadOutline = await evalOutline.create({ file, fileName });

        res.status(201).json({
            message: "인사평가 개요 파일 업로드가 완료되었습니다.",
            file: file,
        });
    } catch (error) {
        console.error("인사평가 개요 파일 업로드 실패: ", error);
        res.status(500).json({ error: "인사평가 개요 파일 업로드에 실패했습니다." });
    }
};

// 추후 파일 자체로 보낼 수 있도록 수정 부탁드립니다
//인사평가 개요 파일 조회 --------------------------------------------------
const getEvalOutline = async (req, res) => {
    try {
        // DB에서 하나의 인사평가 개요 파일만 조회
        const outline = await evalOutline.findOne();

        if (!outline) {
            return res.status(404).json({ error: "인사평가 개요 파일이 없습니다." });
        }

        // 단일 객체로 응답
        res.status(200).json(outline);
    } catch (error) {
        console.error("인사평가 개요 파일 조회 실패:", error);
        res.status(500).json({ error: "인사평가 개요 파일 조회에 실패했습니다." });
    }
};

module.exports = {
    uploadEvalOutline,
    getEvalOutline
};