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
  const [clickIdx, setClickIdx] = useState<string>('');
  
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleDeleteDocument = (name: string) => {
    setDeleteModalOpen(false);
    console.log('클릭된 게시글 인덱스',name)
    const params = {
      filename: name
    }
    DeletePerform(params)
    .then((response) => {
      console.log("인사평가 문서가 삭제되었습니다.", response);
      refetch();
    })
    .catch((error) => {
      console.error("인사평가 문서 삭제에 실패했습니다.", error);
    });
  };

  const fetchManagePerform = async () => {
    const params = {
      userID: isSelectMember[0],
      username: isSelectMember[1],
    };

    try {
      const response = await CheckPerform(params);
      return response.data.files;
    } catch (error) {
      console.error("Error fetching performance data:", error);
      return [];
    }
  };

  const { data, refetch } = useQuery("managePerform", fetchManagePerform, {
    enabled: !!isSelectMember[0],
    onSuccess: (data) => {
      setManagePerform(Array.isArray(data) ? data : []);
    },
    onError: (error) => {
      console.log(error);
      setManagePerform([]);
    }
  });

  useEffect(() => {
    if (isSelectMember[0]) {
      refetch();
    }
  }, [isSelectMember, refetch]);

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
                    .map((userPerform, index) => (
                      <tr key={userPerform.id} className="board_content">
                        <td>{(page - 1) * postPerPage + index + 1}</td>
                        <td style={{textAlign: 'center'}}>{userPerform.filename}</td>
                        <td>{userPerform.date}</td>
                        <td style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'10px', height:'53px'}}>
                          <button className="primary_button" onClick={() => navigate(`/detail-manage-perform`, {state: {username: isSelectMember[1], filename: userPerform.filename}})}>문서확인</button>
                          <button className="red_button" onClick={() => {setDeleteModalOpen(true); setClickIdx(userPerform.filename);}}>삭제</button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              <div className="manage_main_bottom">
                <Pagination
                  activePage={page}
                  itemsCountPerPage={postPerPage}
                  totalItemsCount={managePerform?.length}
                  pageRangeDisplayed={5}
                  prevPageText={<LeftIcon />}
                  nextPageText={<RightIcon />}
                  firstPageText={<FirstLeftIcon />}
                  lastPageText={<LastRightIcon />}
                  onChange={handlePageChange}
                />
              </div>
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
