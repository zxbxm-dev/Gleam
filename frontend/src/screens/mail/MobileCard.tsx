import React, { useState, Dispatch, SetStateAction } from "react";
import CustomModal from "../../components/modal/CustomModal";
import {
  FourchainsLogo,
} from "../../assets/images/index";
import { useRecoilState } from 'recoil';
import { userState } from '../../recoil/atoms';

interface Mobile {
  isMobileCardModal: boolean;
  setIsMobileCardModal: Dispatch<SetStateAction<boolean>>;
}


const MobileCard: React.FC<Mobile> = ({ isMobileCardModal, setIsMobileCardModal }) => {
  const [user, setUserState] = useRecoilState(userState);
  const [isMobileCard, setIsMobileCard] = useState(user?.MobileCard);

  const handleUseMoileCard = (e: any) => {
    const selectedCompany = e.target.value;
    setIsMobileCard(selectedCompany);

    const updatedUserState = { ...user, MobileCard: selectedCompany };
    setUserState(updatedUserState);

    localStorage.setItem('userState', JSON.stringify(updatedUserState));
  };
  
  return (
    <div>
      <CustomModal
        isOpen={isMobileCardModal}
        onClose={() => setIsMobileCardModal(false)}
        header={'모바일 명함'}
        width="380px"
        height="360px"
      >
        <div className="body-container">
          <div className="mobile_card_wrap">
            <fieldset className="Field" onChange={handleUseMoileCard}>
              <label className="custom-radio">
                <input type="radio" name="MobileCard" value="사용 함" checked={isMobileCard === "사용 함"}/>
                <span>사용 함</span>
                <span className="checkmark"></span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="MobileCard" value="사용 안함" checked={isMobileCard === "사용 안함"}/>
                <span>사용 안함</span>
                <span className="checkmark"></span>
              </label>
            </fieldset>
          </div>

          {isMobileCard ==='사용 함' &&
            <div className="mobile_card_content">
              <div>
                예시 이메일 데이터입니다. <br/>
                사용 함을 표시하면 작성된 메일 하단에 <br/>
                아래와 같이 모바일 명함이 표시됩니다.
              </div>

              <div>
                <img src={FourchainsLogo} alt="FourchainsLogo"/>
              </div>

              <div className="mobile_user_info">
                <div><span className="mobile_user_info_bold">{user.username}</span> <span className="mobile_user_info_mid">{user.team} / {user.position}</span></div>
                <div><span className="mobile_user_info_bold">Tel</span> <span className="mobile_user_info_Reg">+82 01000000000</span></div>
                <div><span className="mobile_user_info_bold">Mobile</span> <span className="mobile_user_info_Reg">+82 01000000000</span></div>
                <div><span className="mobile_user_info_bold">Email</span> <span className="mobile_user_info_Reg">fourchains@four-chains.com</span></div>
                <div><span>경기 고양시 일산서구 킨텍스로 217-59 오피스동 703호</span></div>
              </div>  
            </div>
          }
        </div>
      </CustomModal>
    </div>
  )
}

export default MobileCard;