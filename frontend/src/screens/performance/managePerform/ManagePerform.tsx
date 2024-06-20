import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
  const postPerPage: number = 10;
  const [managePerform, setManagePerform] = useState<any[]>([]);
  const [userManagePerform, setUserManagePerform] = useState<any[]>([]);
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
    const initialManagePerform = [
      { id: 1, title: "구민석1", writer: "구민석", date: "2024-05-01" },
      { id: 2, title: "구민석2", writer: "구민석", date: "2024-05-02" },
      { id: 3, title: "구민석3", writer: "구민석", date: "2024-05-03" },
      { id: 4, title: "구민석4", writer: "구민석", date: "2024-05-01" },
      { id: 5, title: "장현지1", writer: "장현지", date: "2024-05-02" },
      { id: 6, title: "장현지2", writer: "장현지", date: "2024-05-03" },
      { id: 7, title: "장현지3", writer: "장현지", date: "2024-05-01" },
      { id: 8, title: "장현지4", writer: "장현지", date: "2024-05-02" },
      { id: 9, title: "진유빈1", writer: "진유빈", date: "2024-05-01" },
      { id: 10, title: "진유빈2", writer: "진유빈", date: "2024-05-02" },
      { id: 11, title: "진유빈3", writer: "진유빈", date: "2024-05-01" },
      { id: 12, title: "진유빈4", writer: "진유빈", date: "2024-05-02" },
    ];
    setManagePerform(initialManagePerform);
  }, []);

  useEffect(() => {
    const filteredPerform = managePerform.filter(doc => doc.writer === isSelectMember[0]);
    const initializedPerform = filteredPerform.map((doc, index) => ({
      ...doc,
      id: filteredPerform.length - index
    }));
    setUserManagePerform(initializedPerform);
  }, [isSelectMember, managePerform]);
  
  // 인사평가 목록 불러오기 (전체)
  const fetchmanagePerform = async () => {
    try {
      const response = await CheckPerform();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
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
      <div className="sub_header">{isSelectMember[0]}</div>
          {isSelectMember[0] === '' ? (
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
                  {userManagePerform
                    .slice((page - 1) * postPerPage, page * postPerPage)
                    .map((userPerform) => (
                      <tr key={userPerform.id} className="board_content">
                        <td>{userPerform.id}</td>
                        <td style={{textAlign: 'center'}}>{userPerform.title}</td>
                        <td>{userPerform.date}</td>
                        <td>
                          <button className="primary_button">문서확인</button>
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
                    totalItemsCount={userManagePerform.length}
                    pageRangeDisplayed={Math.ceil(userManagePerform.length / postPerPage)}
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