const models = require("../../models");
const transfer = models.TransferPosition;

// 인사이동 등록 --------------------------------------------------------------------------------------------
const PersonnelTransfer = async (req, res) => {
  try {
    const { username, Newdept, Newposition, Newspot, Newteam, date, classify } = req.body;

    console.log("인사이동 등록: ", req.body);

    // 데이터베이스에 새로운 인사이동 등록
    const newTransfer = await transfer.create({
      username: username,
      Newdept: Newdept,
      Newposition: Newposition,
      Newspot: Newspot,
      Newteam: Newteam,
      date: date,
      classify: classify
    });

    console.log(`새로운 인사이동 정보 등록: ${newTransfer}`);
    res.status(201).json({
      message: "새로운 인사이동 정보 등록이 완료되었습니다.",
      Management: newTransfer,
    });
  } catch (error) {
    console.error("인사이동 등록 에러:", error);
    res.status(500).json({ error: "인사이동 등록 중 오류가 발생했습니다." });
  }
};

// 인사이동 조회 --------------------------------------------------------------------------------------------
const checkTransfer = async (req, res) => {
  try {
    const data = await transfer.findAll();

    res.status(200).json({ data });
  } catch (error) {
    console.error('인사이동 정보 조회 에러:', error);
    res.status(500).json({ error: '인사이동 정보 조회 중 오류가 발생했습니다.' });
  }
};

// 인사이동 수정 --------------------------------------------------------------------------------------------
const updateTransfer = async (req, res) => {
  try {
    const { appoint_id } = req.params;
    const { username, Newdept, Newposition, Newspot, Newteam, date, classify } = req.body;

    console.log(`인사이동 수정 요청: id=${appoint_id}, data=`, req.body);

    const transferToUpdate = await transfer.findByPk(appoint_id);

    if (!transferToUpdate) {
      return res.status(404).json({ error: "해당 인사이동 정보를 찾을 수 없습니다." });
    }

    // 기존 데이터 유지하면서 새로운 데이터로 업데이트
    const updatedTransfer = await transferToUpdate.update({
      username: username !== undefined ? username : transferToUpdate.username,
      Newdept: Newdept !== undefined ? Newdept : transferToUpdate.Newdept,
      Newposition: Newposition !== undefined ? Newposition : transferToUpdate.Newposition,
      Newspot: Newspot !== undefined ? Newspot : transferToUpdate.Newspot,
      Newteam: Newteam !== undefined ? Newteam : transferToUpdate.Newteam,
      date: date !== undefined ? date : transferToUpdate.date,
      classify: classify !== undefined ? classify : transferToUpdate.classify,
    });

    console.log(`인사이동 정보 수정 완료: ${updatedTransfer}`);
    res.status(200).json({
      message: "인사이동 정보 수정이 완료되었습니다.",
      Management: updatedTransfer,
    });
  } catch (error) {
    console.error("인사이동 수정 에러:", error);
    res.status(500).json({ error: "인사이동 수정 중 오류가 발생했습니다." });
  }
};

// 인사이동 삭제 --------------------------------------------------------------------------------------------
const deleteTransfer = async (req, res) => {
    try {
      const { appoint_id } = req.params;
  
      console.log(`인사이동 삭제 요청: id=${appoint_id}`);
  
      const transferToDelete = await transfer.findByPk(appoint_id);
  
      if (!transferToDelete) {
        return res.status(404).json({ error: "해당 인사이동 정보를 찾을 수 없습니다." });
      }
  
      await transferToDelete.destroy();
  
      console.log(`인사이동 정보 삭제 완료: id=${appoint_id}`);
      res.status(200).json({
        message: "인사이동 정보 삭제가 완료되었습니다.",
      });
    } catch (error) {
      console.error("인사이동 삭제 에러:", error);
      res.status(500).json({ error: "인사이동 삭제 중 오류가 발생했습니다." });
    }
  };

  // 직무변경---------------------------------------------------------------------------------------
  const editUserInfoManagement = async ( req, res ) => {
    const { userID } = req.params;
    const { company, team, department, position, spot } = req.body.data;
    try{

      if(!userID){
        return res.status(404).json({ error : " 해당 사용자 정보를 찾을 수 없습니다." });
      }

      //직무변경 
      const editInfo = await user.update(
        {
            company: company !== undefined ? company : undefined,
            team: team !== undefined ? team : undefined,
            department: department !== undefined ? department : undefined,
            position: position !== undefined ? position : undefined,
            spot: spot !== undefined ? spot : undefined,
        },
        {
            where: { userID: userID }, 
        }
     );
     
      console.log(`직무변경 완료 : ${editInfo} `);

      res.status(200).json({
        message : "직무변경이 성공적으로 완료되었습니다.",
        User : editInfo,
      });

    }catch (error) {
      console.error("직무 변경 중 오류 발생 : ",  error );
      res.status(500).json({ error : " 직무 변경 중 오류가 발생했습니다. "});
    };

  }
  module.exports = {
    PersonnelTransfer,
    checkTransfer,
    updateTransfer,
    deleteTransfer,
    editUserInfoManagement,
  };