const models = require("../../models");
const Report = models.Report;

//보고서 참조자 추가 -------------------------------------------------
const addReferrer = async (req, res) => {
    const{ report_id } = req.params;
    const { referrer } = req.body;

    try{
        const report = await Report.findByPk(report_id);
        if(!report){
            return res.status(404).json({ error: "해당 보고서를 찾을 수 없습니다." })
        }

        //참조자 데이터 형식 검사
        let newReferrer;
        if( Array.isArray(referrer)){
            newReferrer = referrer.join(", ")
        }else if(typeof referrer === "string"){
            newReferrer = referrer;
        }else{
            return res.status(400).json({ error : "참조자 데이터는 배열 또는 문자열 형태이어야 합니다."})
        }

        //기존 참조자 확인 
        const existingReferrer = report.referName? report.referName.split(", "):[];
        existingReferrer.push(...newReferrer.split(", "));

        //참조자 추가 및 중복 제거 
        const updateReferrer = Array.from(new Set(existingReferrer)).join(", ");
        report.referName = updateReferrer;

        await report.save();

        res.status(200).json({ message: " 참조자 추가가 성공적으로 완료되었습니다.", updateReferrer});
    }catch(error){
        console.error("참조자 추가 중 에러가 발생했습니다.", error);
        return res.status(500).json({ error: "참조자 추가에 실패했습니다."});
    }
}

module.exports ={
    addReferrer,
}