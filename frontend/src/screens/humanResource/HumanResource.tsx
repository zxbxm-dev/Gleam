import React, { useState } from "react";
import "./HumanResource.scss";
import { Link } from "react-router-dom";
import { Input } from '@chakra-ui/react';
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseButton,
  Portal,
} from '@chakra-ui/react';
import CustomModal from "../../components/modal/CustomModal";
import { useRecoilState } from 'recoil';
import { isSelectMemberState } from '../../recoil/atoms';

const HumanResource = () => {
  const [isSelectMember] = useRecoilState(isSelectMemberState);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleHumanInfoDelete = () => {
    setDeleteModalOpen(false);
  }


  return (
    <div className="content">
      <div className="content_header">
        {isSelectMember[0] === '' ? (
          <>
            <Link to={"/human-resources"} className="sub_header">인사 정보 관리</Link>
          </>
        ) : (
          <>
            <Link to={"/human-resources"} className="sub_header">인사 정보 관리</Link>
            <div className="main_header">＞</div>
            <div className="sub_header">{isSelectMember[0]}</div>
          </>
        )}
      </div>
      
      <div className="content_container">
          <Tabs variant='enclosed'>
            <TabList>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>인사기록카드</Tab>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>근로자명부</Tab>
              <Tab _selected={{bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)'}} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>인사이동</Tab>
            </TabList>

            <TabPanels bg='white' border='1px solid #DEDEDE' borderBottomRadius='10px' borderRightRadius='10px' className="tab_container">
              <TabPanel display='flex' flexDirection='column'>
                <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                  {isEditing ? (
                    <>
                      <button className="adds_button" onClick={handleToggleEdit}>등록</button>
                      <button className="edits_button">취소</button>
                    </>
                  ) : (
                    <>
                      <button className="edits_button" onClick={handleToggleEdit}>업로드</button>
                      <button className="downloads_button">다운로드</button>
                    </>
                  )}
                </div>
                <div>
                  인사기록카드
                </div>
                
              </TabPanel>

              <TabPanel display='flex' flexDirection='column'>
                <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh' ,borderBottom: '1px solid #DCDCDC', gap: '10px'}}>
                  {isEditing ? (
                    <>
                      <button className="adds_button" onClick={handleToggleEdit}>등록</button>
                      <button className="edits_button">취소</button>
                    </>
                  ) : (
                    <>
                      <button className="edits_button" onClick={handleToggleEdit}>업로드</button>
                      <button className="downloads_button">다운로드</button>
                    </>
                  )}
                </div>
                <div>
                  근로자명부
                </div>
                
              </TabPanel>

              <TabPanel display='flex' flexDirection='column'>
                <div style={{display: 'flex', flexDirection: 'row-reverse', width: '100%', height: '5vh'}}>
                  <Popover placement="left-start">
                    <PopoverTrigger>
                      <button className="adds_button">등록</button>
                    </PopoverTrigger>
                    <Portal>
                      <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                        <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>인사이동 등록하기</PopoverHeader>
                        <PopoverCloseButton color='white'/>
                        <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center'>
                          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' , alignItems: 'center'}}>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>부서</div>
                              <Input placeholder='ex) 개발부 개발 1팀' size='sm' width='20vw' />
                            </div>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>직위</div>
                              <Input placeholder='내용을 입력해주세요.' size='sm' width='20vw'/>
                            </div>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>날짜</div>
                              <Input placeholder='small size' size='sm' width='20vw'/>
                            </div>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>구분</div>
                              <Input placeholder='승진 / 부서이동 / 강등' size='sm' width='20vw'/>
                            </div>
                          </div>
                          <div className='button-wrap'>
                            <button className="adds_button">등록</button>
                            <button className="edits_button">취소</button>
                          </div>
                        </PopoverBody>
                      </PopoverContent>
                    </Portal>
                  </Popover>
                </div>
                
                <div>
                  <table className="announce_board_list">
                    <colgroup>
                      <col width="20%"/>
                      <col width="20%"/>
                      <col width="20%"/>
                      <col width="20%"/>
                      <col width="20%"/>
                    </colgroup>
                    <thead>
                      <tr className="board_header">
                        <th>부서</th>
                        <th>직위</th>
                        <th>날짜</th>
                        <th>구분</th>
                        <th>수정/삭제</th>
                      </tr>
                    </thead>
                    <tbody className="board_container">
                      <tr className="board_content">
                        <td>마케팅부 디자인팀</td>
                        <td>팀장</td>
                        <td>2024-05-04</td>
                        <td>승진</td>
                        <td>
                          <Popover placement="left-start">
                            <PopoverTrigger>
                              <button className="edits_button">수정</button>
                            </PopoverTrigger>
                            <Portal>
                              <PopoverContent width='25vw' height='35vh' border='0' borderRadius='5px' boxShadow='0px 0px 5px #444'>
                                <PopoverHeader color='white' bg='#746E58' border='0' fontFamily= 'var(--font-family-Noto-B)' borderTopRadius='5px'>인사이동 수정하기</PopoverHeader>
                                <PopoverCloseButton color='white'/>
                                <PopoverBody display='flex' flexDirection='column' padding='0px' justifyContent='center' alignItems='center'>
                                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px', height: '24vh', justifyContent: 'center' , alignItems: 'center'}}>
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                      <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>부서</div>
                                      <Input placeholder='ex) 개발부 개발 1팀' size='sm' width='20vw' />
                                    </div>
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                      <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>직위</div>
                                      <Input placeholder='내용을 입력해주세요.' size='sm' width='20vw'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                      <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>날짜</div>
                                      <Input placeholder='small size' size='sm' width='20vw'/>
                                    </div>
                                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                      <div style={{width: '2vw', textAlign: 'right', color: '#929292', fontFamily: 'var(--font-family-Noto-M)'}}>구분</div>
                                      <Input placeholder='승진 / 부서이동 / 강등' size='sm' width='20vw'/>
                                    </div>
                                  </div>
                                  <div className='button-wrap'>
                                    <button className="edits_button">수정</button>
                                    <button className="edits_button">취소</button>
                                  </div>
                                </PopoverBody>
                              </PopoverContent>
                            </Portal>
                          </Popover>
                          <button className="dels_button" onClick={() => setDeleteModalOpen(true)}>삭제</button>
                        </td>
                      </tr>

                      <tr className="board_content">
                        <td>관리부 지원팀</td>
                        <td>사원</td>
                        <td>2024-05-04</td>
                        <td>부서이동</td>
                        <td>
                          <button className="edits_button">수정</button>
                          <button className="dels_button">삭제</button>
                        </td>
                      </tr>

                      <tr className="board_content">
                        <td>개발부 개발 1팀</td>
                        <td>사원</td>
                        <td>2024-05-04</td>
                        <td>강등</td>
                        <td>
                          <button className="edits_button">수정</button>
                          <button className="dels_button">삭제</button>
                        </td>
                      </tr>

                      <tr className="board_content">
                        <td>개발부 개발 1팀</td>
                        <td>팀장</td>
                        <td>2024-05-04</td>
                        <td>부서이동</td>
                        <td>
                          <button className="edits_button">수정</button>
                          <button className="dels_button">삭제</button>
                        </td>
                      </tr>
                     
                    </tbody>
                  </table>
                </div>
                
              </TabPanel>
            </TabPanels>
          </Tabs>
      </div>  
      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)} 
        header={'알림'}
        footer1={'삭제'}
        footer1Class="red-btn"
        onFooter1Click={handleHumanInfoDelete}
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

export default HumanResource;