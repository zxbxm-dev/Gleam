import { useState, useEffect } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/FirstLeftIcon.svg";
import { Link } from "react-router-dom";
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


const UserManagement = () => {
  const [page, setPage] = useState<number>(1); 
  const [usermanages, setUserManages] = useState<any[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const { isOpen: isSignModalOpen, onOpen: onSignModalOpen, onClose: isSignModalClose } = useDisclosure();
  const { isOpen: isDelModalOpen, onOpen: onDelModalOpen, onClose: onDelModalClose } = useDisclosure();
  const postPerPage: number = 10;

  useEffect(() => {
    const initialUserManage = [
      { name: '서주희', company: "본사", dept: "마케팅부 디자인팀", spot: "사원/사원", date: "2024-05-01" },
      { name: '함다슬', company: "본사", dept: "마케팅부 기획팀", spot: "사원/사원", date: "2024-05-01"  },
      { name: '우현지', company: "본사", dept: "관리부 관리팀", spot: "사원/사원", date: "2024-05-01"  },
      { name: '장현지', company: "본사", dept: "개발부 개발1팀", spot: "사원/사원", date: "2024-05-01"  },
      { name: '전아름', company: "본사", dept: "마케팅부 기획팀", spot: "책임/팀장", date: "2024-05-01"  },
      { name: '구민석', company: "본사", dept: "개발부 개발1팀", spot: "사원/사원", date: "2024-05-01"  },
      { name: '김도환', company: "본사", dept: "블록체인 사업부 블록체인 1팀", spot: "사원/사원", date: "2024-05-01"  },
      { name: '임지현', company: "R&D 센터", dept: "알고리즘 연구실 AI 연구팀", spot: "사원/연구원", date: "2024-05-01"  },
      { name: '박소연', company: "R&D 센터", dept: "블록체인 연구실 AI 개발팀", spot: "사원/연구원", date: "2024-05-01"  },
      { name: '김희진', company: "R&D 센터", dept: "알고리즘 연구실 AI 연구팀", spot: "사원/연구원", date: "2024-05-01"  },
      { name: '진유빈', company: "본사", dept: "개발부 개발1팀", spot: "사원/부서장", date: "2024-05-01"  },
      { name: '김태희', company: "본사", dept: "관리부 지원팀", spot: "사원/팀장", date: "2024-05-01"  },
    ];
    setUserManages(initialUserManage);
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  }



  const handleDelete = () => {
    // 삭제하기 기능 추가
    // DeleteEmployment()
    setDropdownOpen(false);
  };


  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownOpen && !event.target.closest('.dropdown-menu')) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/employment"} className="sub_header">회원관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">

          <div style={{marginTop: '50px'}}>
            <table className="regulation_board_list">
              <colgroup>
                <col width="10%"/>
                <col width="10%"/>
                <col width="35%"/>
                <col width="10%"/>
                <col width="10%"/>
                <col width="15%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>성명</th>
                  <th>회사구분</th>
                  <th>부서</th>
                  <th>직위/직책</th>
                  <th>가입날짜</th>
                  <th>승인/삭제</th>
                </tr>
              </thead>
              <tbody>
                {usermanages
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((usermanage) => (
                    <tr key={usermanage.id} className="board_content">
                      <td>{usermanage.name}</td>
                      <td>{usermanage.company}</td>
                      <td>{usermanage.dept}</td>
                      <td>{usermanage.spot}</td>
                      <td>{usermanage.date}</td>
                      <td>
                        <button className="edits_button" onClick={onSignModalOpen}>승인</button>
                        <button className="dels_button" onClick={onDelModalOpen}>삭제</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="main_bottom">
              <Pagination
                activePage={page}
                itemsCountPerPage={postPerPage}
                totalItemsCount={usermanages.length}
                pageRangeDisplayed={Math.ceil(usermanages.length / postPerPage)}
                prevPageText={<LeftIcon />}
                nextPageText={<RightIcon />}
                firstPageText={<FirstLeftIcon />}
                lastPageText={<LastRightIcon />}
                onChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>  
      <Modal isOpen={isSignModalOpen} onClose={isSignModalClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader className='ModalHeader' height='34px' bg='#746E58' fontSize='14px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0'/>
          <ModalBody className="cancle_modal_content">
            승인하시겠습니까?
          </ModalBody>

          <ModalFooter gap='7px' justifyContent='center'>
            <button className="del_button" onClick={handleDelete}>승인</button>
            <button className="cle_button" onClick={isSignModalClose}>취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDelModalOpen} onClose={onDelModalClose} isCentered={true}>
        <ModalContent height='200px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader className='ModalHeader' height='34px' bg='#746E58' fontSize='14px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='12px' top='0'/>
          <ModalBody className="cancle_modal_content">
            삭제하시겠습니까?
          </ModalBody>

          <ModalFooter gap='7px' justifyContent='center'>
            <button className="del_button" onClick={handleDelete}>삭제</button>
            <button className="cle_button" onClick={onDelModalClose}>취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserManagement;