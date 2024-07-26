import React, { Dispatch, SetStateAction } from "react";
import CustomModal from "../../components/modal/CustomModal";

interface Block {
  isSpamSettingModal: boolean;
  setIsSpamSettingModal: Dispatch<SetStateAction<boolean>>;
}

const BlockMail: React.FC<Block> = ({ isSpamSettingModal, setIsSpamSettingModal }) => {
  return (
    <div>
      <CustomModal
        isOpen={isSpamSettingModal}
        onClose={() => setIsSpamSettingModal(false)}
        header={'스팸 설정'}
        width="380px"
        height="360px"
      >
        <div className="body-container">
          <div className="modal_container_wrap">
            <span>차단 등록</span>
            <div>
              <input
                type="text"
              />
            </div>
            <button>확인</button>
          </div>
          <div className="modal_container_wrap">
            <span>수신 차단 목록</span>
            <button>해제</button>
          </div>
          <div className="modal_spamlist_wrap">

          </div>
        </div>
      </CustomModal>
    </div>
  )
}

export default BlockMail;