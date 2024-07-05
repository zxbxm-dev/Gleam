import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; 
import { useRecoilState } from 'recoil';
import { isSelectMemberState } from '../../../recoil/atoms';
import { ReactComponent as RightIcon } from "../../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/Common/FirstLeftIcon.svg";
import Pagination from "react-js-pagination";
import CustomModal from "../../../components/modal/CustomModal";

import { useQuery } from "react-query";
import { CheckPerform, DeletePerform } from "../../../services/performance/PerformanceServices";


const ManagePerform = () => {
  let navigate = useNavigate();
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const postPerPage: number = 10;
  const [managePerform, setManagePerform] = useState<any[]>([]);
  const [clickIdx, setClickIdx] = useState<number>(0);
  
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleDeleteDocument = (index: number) => {
    setDeleteModalOpen(false);
    console.log('클릭된 게시글 인덱스',index)
    DeletePerform(index)
    .then((response) => {
      console.log("인사평가 문서가 삭제되었습니다.", response);
    })
    .catch((error) => {
      console.error("인사평가 문서 삭제에 실패했습니다.", error);
    });
  };

  useEffect(() => {
    fetchmanagePerform();
  }, [isSelectMember, managePerform]);
  
  // 인사평가 목록 불러오기 (회원 마다)
  const fetchmanagePerform = async () => {
    const params = {
      userID: isSelectMember[0],
      username: isSelectMember[1],
    };

    try {
      const response = await CheckPerform(params);
      return response.data;

    } catch (error) {
      console.log("Failed to fetch data");
    }
  }

  useQuery("managePerform", fetchmanagePerform, {
    onSuccess: (data) => setManagePerform(data),
    onError: (error) => {
      console.log(error)
    }
  });


  
  return (
    <div className="content">
      <div className="content_container">
      <div className="sub_header">{isSelectMember[1]}</div>
          {isSelectMember[1] === '' ? (
            <>
            </>
          ) : (
            <div className="approval_btm">
              <table className="approval_board_list">
                <colgroup>
                  <col width="10%"/>
                  <col width="45%"/>
                  <col width="20%"/>
                  <col width="25%"/>
                </colgroup>
                <thead>
                  <tr className="board_header">
                    <th>순번</th>
                    <th>제목</th>
                    <th>날짜</th>
                    <th>문서확인 / 삭제</th>
                  </tr>
                </thead>
                <tbody className="board_container">
                  {(managePerform || [])
                    .slice((page - 1) * postPerPage, page * postPerPage)
                    .map((userPerform) => (
                      <tr key={userPerform.id} className="board_content">
                        <td>{userPerform.id}</td>
                        <td style={{textAlign: 'center'}}>{userPerform.title}</td>
                        <td>{userPerform.date}</td>
                        <td style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', height:'53px'}}>
                          <button className="primary_button" onClick={() => navigate(`/detail-manage-perform/${userPerform.id}`, {state: {username: isSelectMember[0], perform_id: userPerform.id}})}>문서확인</button>
                          <button className="red_button" onClick={() => {setDeleteModalOpen(true); setClickIdx(Number(userPerform.id));}}>삭제</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
                <div className="manage_main_bottom">
                  <Pagination
                    activePage={page}
                    itemsCountPerPage={postPerPage}
                    totalItemsCount={managePerform?.length}
                    pageRangeDisplayed={Math.ceil(managePerform?.length / postPerPage)}
                    prevPageText={<LeftIcon />}
                    nextPageText={<RightIcon />}
                    firstPageText={<FirstLeftIcon />}
                    lastPageText={<LastRightIcon />}
                    onChange={handlePageChange}
                  />
                </div>
              </table>
            </div>
          )}
      </div>  
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={() => handleDeleteDocument(clickIdx)}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDeleteModalOpen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default ManagePerform;