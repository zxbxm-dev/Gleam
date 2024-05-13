import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { isSelectMemberState } from '../../../recoil/atoms';
import { ReactComponent as RightIcon } from "../../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/FirstLeftIcon.svg";
import Pagination from "react-js-pagination";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';


const ManagePerform = () => {
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [page, setPage] = useState<number>(1);
  const postPerPage: number = 10;
  const [managePerform, setManagePerform] = useState<any[]>([]);
  const [userManagePerform, setUserManagePerform] = useState<any[]>([]);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleDeleteDocument = () => {
    onClose();
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

  return (
    <div className="content">
      <div className="content_header">
        {isSelectMember[0] === '' ? (
          <>
            <Link to={"/submitPerform"} className="sub_header">인사평가 관리</Link>
          </>
        ) : (
          <>
            <Link to={"/submitPerform"} className="main_header">인사평가 관리</Link>
            <div className="main_header">＞</div>
            <div className="sub_header">{isSelectMember[0]}</div>
          </>
        )}
      </div>
      
      <div className="content_container">
        <div className="container">
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
                    <th>문서확인/삭제</th>
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
                          <button className="document_button">문서확인</button>
                          <button className="delete_small_button" onClick={onOpen}>삭제</button>
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
      </div>  
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='5px'>
          <ModalHeader className='ModalHeader' bg='#746E58' fontSize='14px' height='34px' color='#fff' borderTopRadius='5px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0' />
          <ModalBody className="cancle_modal_content">
            삭제하시겠습니까?
          </ModalBody>

          <ModalFooter gap='10px' justifyContent='center'>
            <button className="del_button" onClick={handleDeleteDocument}>삭제</button>
            <button className="cle_button" onClick={onClose}>취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ManagePerform;