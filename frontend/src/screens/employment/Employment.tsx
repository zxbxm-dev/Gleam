import { useState } from "react";
import {
  SearchIcon
} from "../../assets/images/index";
import { ReactComponent as RightIcon } from "../../assets/images/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/FirstLeftIcon.svg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
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
import { Input } from '@chakra-ui/react';

const Employment = () => {
  const [page, setPage] = useState<number>(1); 
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const postPerPage: number = 10;

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleRightClick = (event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX, y: event.pageY });
  };

  const handleEdit = () => {
    // 수정하기 기능 추가
  };

  const handleDelete = () => {
    // 삭제하기 기능 추가
    onOpen();
    setDropdownOpen(false);
  };

  
  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/employment"} className="sub_header">채용공고</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">채용공고</div>
            <div className="input-wrapper">
              <input type="search" className="input_form" />
              <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
            </div>
          </div>

          <div>
            <table className="regulation_board_list">
              <colgroup>
                <col width="6%"/>
                <col width="24%"/>
                <col width="50%"/>
                <col width="10%"/>
                <col width="10%"/>
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>공고 제목</th>
                  <th>URL</th>
                  <th>사이트</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody>
                <tr className="board_content">
                  <td>10</td>
                  <td style={{ textAlign: "left", paddingLeft: "50px" }}>
                    <div
                      className="dropdown" // 드롭다운 클래스 추가
                      onContextMenu={handleRightClick} // 우클릭 이벤트 핸들링
                    >
                      [신입 환영] 채용공고
                      {dropdownOpen && ( // 드롭다운 메뉴 열림 여부에 따라 메뉴 표시
                        <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 50, left: dropdownPosition.x - 250 }}>
                          <Popover placement="right-start">
                            <PopoverTrigger>
                              <button className="dropdown_edit" onClick={handleEdit}>수정하기</button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent width='400px' height='250px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                                <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>채용공고 수정하기</PopoverHeader>
                                <PopoverCloseButton color='white'/>
                                <PopoverBody display='flex' flexDirection='column' alignItems='center'>
                                  <div style={{width: '400px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '10px'}}>
                                    <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <div style={{width: '80px', textAlign: 'right'}}>공고제목</div>
                                      <Input placeholder='ex) 디자인 채용공고' size='sm' />
                                    </div>
                                    <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <div style={{width: '80px', textAlign: 'right'}}>링크</div>
                                      <Input placeholder='내용을 입력해주세요.' size='sm' />
                                    </div>
                                    <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                      <div style={{width: '80px', textAlign: 'right'}}>사이트명</div>
                                      <Input placeholder='내용을 입력해주세요.' size='sm' />
                                    </div>
                                  </div>
                                  <div style={{display: 'flex', gap: '10px'}}>
                                    <button style={{width: '70px', height: '35px', color: '#746E58', backgroundColor: '#fff', border: '1px solid #746E58', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)'}}>수정</button>
                                    <button style={{width: '70px', height: '35px', color: '#929292', backgroundColor: '#fff', border: '1px solid #929292', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)'}}>취소</button>
                                  </div>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                          <div className="dropdown_del" onClick={handleDelete}>삭제하기</div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td style={{textDecoration: 'underline'}}>
                    <a href="https://www.jobkorea.co.kr/" target="_blank" rel="noopener noreferrer">https://www.jobkorea.co.kr/</a>
                  </td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>9</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>사무직 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>8</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>보안 개발자 채용공...</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>7</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>R&D 연구센터 채용...</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>6</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>빅데이터 분석 채용...</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>5</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>[신입 환영] 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>4</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>[신입 환영] 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>3</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>[신입 환영] 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>2</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>[신입 환영] 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
                </tr>
                <tr className="board_content">
                  <td>1</td>
                  <td style={{textAlign: 'left', paddingLeft: '50px'}}>[신입 환영] 채용공고</td>
                  <td>https://www.jobkorea.co.kr/</td>
                  <td>잡코리아</td>
                  <td>2099-99-99</td>
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
            <Popover placement="left-start">
              <PopoverTrigger>
                <button className="primary_button">게시물 작성</button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent width='400px' height='250px' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                  <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>채용공고 등록하기</PopoverHeader>
                  <PopoverCloseButton color='white'/>
                  <PopoverBody display='flex' flexDirection='column' alignItems='center'>
                    <div style={{width: '400px', height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '10px', padding: '10px'}}>
                      <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '80px', textAlign: 'right'}}>공고제목</div>
                        <Input placeholder='ex) 디자인 채용공고' size='sm' />
                      </div>
                      <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '80px', textAlign: 'right'}}>링크</div>
                        <Input placeholder='내용을 입력해주세요.' size='sm' />
                      </div>
                      <div style={{fontSize: '16px', color: '#909090', fontFamily: 'var(--font-family-Noto-M)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <div style={{width: '80px', textAlign: 'right'}}>사이트명</div>
                        <Input placeholder='내용을 입력해주세요.' size='sm' />
                      </div>
                    </div>
                    <div style={{display: 'flex', gap: '10px'}}>
                      <button style={{width: '70px', height: '35px', color: '#fff', backgroundColor: '#746E58', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)'}}>등록</button>
                      <button style={{width: '70px', height: '35px', color: '#746E58', backgroundColor: '#fff', border: '1px solid #929292', borderRadius: '5px', fontFamily: 'var(--font-family-Noto-B)'}}>취소</button>
                    </div>
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
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
            <button className="cle_button">취소</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Employment;