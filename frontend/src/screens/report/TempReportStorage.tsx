import { useState } from "react";
import "./Report.scss";
import { ReactComponent as RightIcon } from "../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/FirstLeftIcon.svg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';


const TempReportStorage = () => {
  const [page, setPage] = useState<number>(1); 
  const { isOpen, onOpen, onClose } = useDisclosure()

  const postPerPage: number = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="main_header">보고서</Link>
        <div className="main_header">＞</div>
        <Link to={"/tempReportStorage"} className="sub_header">임시저장 파일 보기</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">　</div>
          </div>

          <div>
            <table className="regulation_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="64%"/>
                <col width="20%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>작성일/시간</th>
                  <th>구분</th>
                </tr>
              </thead>
              <tbody>
                <tr className="board_content">
                  <td>10</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}><Link to={"/detailAnnounce"}>2025년 인사평가 공지</Link></td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button" onClick={onOpen}>삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>9</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>24/01/08 사내 행사 변경</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>8</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>휴가서 양식 변경 사항</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>7</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>각 부서 채용 예정 인원</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>6</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>하계 휴가 공지</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>5</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2025년 법정의무교육 시행 예정</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>4</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2025년 인사발령</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>기획팀 신입사원</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2024년 사내 행사</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
                <tr className="board_content" style={{borderBottom: '2px solid #DCDCDC'}}>
                  <td>1</td>
                  <td style={{textAlign: 'left', paddingLeft: '20px'}}>2024년 사내 워크숍</td>
                  <td>2099-99-99 22:22</td>
                  <td><button className="delete_button">삭제하기</button></td>
                </tr>
              </tbody>
            </table>


            <div className="main_bottom">
              <Pagination 
                activePage={page}
                itemsCountPerPage={postPerPage}
                totalItemsCount={100}
                pageRangeDisplayed={5}
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent height='250px' bg='#fff' borderTopRadius='10px'>
          <ModalHeader bg='#746E58' fontSize='16px' color='#fff' borderTopRadius='10px' fontFamily='var(--font-family-Noto-B)'>알림</ModalHeader>
          <ModalCloseButton color='#fff' fontSize='14px' marginTop='4px'/>
          <ModalBody className="cancle_modal_content">
            삭제하시겠습니까?
          </ModalBody>

          <ModalFooter gap='10px' justifyContent='center'>
            <button className="del_button">삭제</button>
            <button className="cle_button" onClick={onClose}>취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TempReportStorage;