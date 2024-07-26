const models = require("../../models");
const evalOutline = models.evalOutline

//인사평가 개요 파일 업로드
const uploadEvalOutline = async (req, res) => {
    try{
        const { file, fileName } = req.file?{
            file: req.file.path,
            fileName: req.file.fileName,
        } : { file: null, fileName: null };
        console.log("인사평가 개요 파일: ",file, fileName)
    
        const existOutline = await evalOutline.findOne({where:{file:file}});
        let uploadOutline;
        if(existOutline){
            await existOutline.destroy();
            console.log('기존 파일 삭제 성공');
        }
        uploadOutline = await evalOutline.create({ file, fileName })
      

        console.log(`인사평가 개요 업로드 성공: ${uploadOutline.fileName}`);
        res.status(201).json({
            message: "인사평가 개요파일 업로드가 완료되었습니다.",
            file: file,
        });
    }catch(error){
        console.error("인사평가 개요 파일 업로드 실패: ", error);
        res.status(500).json({ error: "인사평가 개요파일 업로드에 실패했습니다." });
    }
    };


//인사평가 개요 파일 조회 --------------------------------------------------
const getEvalOutline = async (req, res) => {
    try{
        
        const outline = await evalOutline.findAll();
        if (!outline) {
            return res.status(400).json({ error: "파일 이름이 제공되지 않았습니다" });
        }
       
        
        res.status(200).json(outline);
    }catch(error){
        console.error("인사평가 개요파일 조회 실패:", error);
        res.status(500).json({error: "인사평가 개요파일이 서버에 존재하지 않습니다" });
    }
};

module.exports = {
    uploadEvalOutline,
    getEvalOutline
};