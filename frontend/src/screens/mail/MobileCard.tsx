import React, { Dispatch, SetStateAction } from "react";
import CustomModal from "../../components/modal/CustomModal";

interface Mobile {
  isMobileCardModal: boolean;
  setIsMobileCardModal: Dispatch<SetStateAction<boolean>>;
}

const MobileCard: React.FC<Mobile> = ({ isMobileCardModal, setIsMobileCardModal }) => {
  return (
    <div>
      <CustomModal
        isOpen={isMobileCardModal}
        onClose={() => setIsMobileCardModal(false)}
        header={'모바일 명함'}
        width="380px"
        height="360px"
      >
        <div>
          모바일 명함 모달
        </div>
      </CustomModal>
    </div>
  )
}

export default MobileCard;