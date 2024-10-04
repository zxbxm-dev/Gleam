import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import CustomModal from "../../components/modal/CustomModal";
import { useRecoilValue } from 'recoil';
import { userState } from '../../recoil/atoms';
import { useQuery } from 'react-query';
import { AddJunkList, CheckJunkList, RemoveJunkList } from "../../services/email/EmailService";

interface Block {
  isSpamSettingModal: boolean;
  setIsSpamSettingModal: Dispatch<SetStateAction<boolean>>;
}

const BlockMail: React.FC<Block> = ({ isSpamSettingModal, setIsSpamSettingModal }) => {
  const user = useRecoilValue(userState);

  const [junkEmail, setJunkEmail] = useState<string>('');
  const [junkList, setJunkList] = useState<any[]>([]);
  const [selectedJunk, setSelectedJunk] = useState<string[]>([]);

  // 스팸 등록 
  const handleAddJunkList = async () => {
    if (!junkEmail.trim()) {
      alert("스팸 등록할 이메일을 입력해주세요.");
      return; // 이메일이 비어 있으면 함수를 중단
    }
    
    const formData = new FormData();
    formData.append('createdBy', user?.userID);
    formData.append('junkId', junkEmail);
    formData.append('registerAt', new Date().toISOString());

    try {
      const response = await AddJunkList(formData);
      console.log('스팸 이메일 등록 성공', response);
      setJunkEmail('');
      refetchJunkList();
    } catch (error) {
      console.log('스팸 이메일 등록 실패', error);
    }
  };

  // 스팸 해제
  const handleRemoveJunkList = async () => {
    try {
      const removePromises = selectedJunk.map((junkId) =>
        RemoveJunkList(junkId, user?.userID)
      );

      await Promise.all(removePromises);
      
      console.log('스팸 이메일 해제 성공');
      setSelectedJunk([]);
      refetchJunkList();
    } catch (error) {
      console.log('스팸 이메일 해제 실패', error);
    }
  };

  // 스팸 리스트 조회
  const fetchJunkList = async () => {
    const params = {
      userId: user?.userID,
    }

    try {
      const response = await CheckJunkList(params);
      return response.data;
    } catch (error) {
      console.log('Error fetching JunkList data', error);
    }
  };

  const { refetch : refetchJunkList } = useQuery("JunkList", fetchJunkList, {
    enabled: false,
    onSuccess: (data) => {
      setJunkList(data.data);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  useEffect(() => {
    if (isSpamSettingModal) {
      refetchJunkList(); // 모달이 열릴 때 스팸 리스트를 새로 고침
    }
  }, [isSpamSettingModal]);

  const handleCheckboxChange = (junkId: string) => {
    setSelectedJunk((prev) =>
      prev.includes(junkId)
        ? prev.filter((id) => id !== junkId)
        : [...prev, junkId]
    );
  };

  return (
    <div>
      <CustomModal
        isOpen={isSpamSettingModal}
        onClose={() => setIsSpamSettingModal(false)}
        header={'스팸 설정'}
        headerTextColor="White"
        footer1={'확인'}
        footer1Class="back-green-btn"
        onFooter1Click={() => setIsSpamSettingModal(false)}
        width="355px"
        height="300px"
      >
        <div className="body-container" style={{padding: '15px 20px 0px 20px'}}>
          <div className="modal_container_wrap">
            <div>
              <input
                type="text"
                value={junkEmail}
                onChange={(e) => setJunkEmail(e.target.value)}
                placeholder="메일 주소 추가"
              />
            </div>
            <button onClick={handleAddJunkList}>확인</button>
          </div>
          <div className="modal_container_wrap" style={{marginTop: '10px'}}>
            <span>수신 차단 목록</span>
            <span className="spam_del_btn" onClick={handleRemoveJunkList}>차단 해제</span>
          </div>
          
          <div className="modal_spamlist_wrap">
            {junkList.length > 0 ? (
              junkList.map((junk) => (
                <div key={junk.junkId} className="junk-item">
                  <input
                    type="checkbox"
                    checked={selectedJunk.includes(junk.junkId)}
                    onChange={() => handleCheckboxChange(junk.junkId)}
                  />
                  <label>{junk.junkId}</label>
                </div>
              ))
            ) : (
              <div>차단된 이메일이 없습니다.</div>
            )}
          </div>
        </div>
      </CustomModal>
    </div>
  )
}

export default BlockMail;