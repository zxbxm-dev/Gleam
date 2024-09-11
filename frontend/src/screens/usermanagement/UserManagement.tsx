import { useState, useEffect } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import Pagination from "react-js-pagination";
import CustomModal from "../../components/modal/CustomModal";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { ArrowDown, ArrowUp } from "../../assets/images/index";

import { useQueryClient, useQuery } from "react-query";
import { CheckUserManagement, ApproveUserManagement, DeleteUserManagement, EditChainLinker } from "../../services/usermanagement/UserManagementServices";

interface SelectedOptions {
  company: string;
  department: string;
  team: string;
  spot: string;
  position: string;
  phoneNumber: string;
  password: string;
}

const UserManagement = () => {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const [pendingusermanages, setPendingUserManages] = useState<any[]>([]);
  const [approvedusermanages, setApprovedUserManages] = useState<any[]>([]);
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [isDelModalOpen, setDelModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [postPerPage, setPostPerPage] = useState<number>(10);
  const [activeTab, setActiveTab] = useState(0);
  const [tabHeights, setTabHeights] = useState({0: '41px', 1: '35px', 2: '35px'});
  const [tabMargins, setTabMargins] = useState({0: '6px', 1: '6px', 2: '6px'});
  const [clickIdx, setClickIdx] = useState<string>('');

  useEffect(() => {
    if (activeTab === 0) {
      setTabHeights({0: '41px', 1: '35px', 2: '35px'});
      setTabMargins({0: '0px', 1: '6px', 2: '6px'});
    } else if (activeTab === 1){
      setTabHeights({0: '35px', 1: '41px', 2: '35px'});
      setTabMargins({0: '6px', 1: '0px', 2: '6px'});
    } else {
      setTabHeights({0: '35px', 1: '35px', 2: '41px'});
      setTabMargins({0: '6px', 1: '6px', 2: '0px'});
    }
  }, [activeTab]);
  
  // 회원관리 조회
  const fetchUserManage = async () => {
    try {
      const response = await CheckUserManagement();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  };

  useQuery("usermanagement", fetchUserManage, {
    onSuccess: (data) => {
      const pendingUsers = data.users.filter((user: any) => user.status === "pending");
      const ApprovedUsers = data.users.filter((user: any) => user.status === "approved");
      setPendingUserManages(pendingUsers);
      setApprovedUserManages(ApprovedUsers);
    },
    onError: (error) => {
      console.log(error)
    }
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1600) {
        setPostPerPage(10); // Desktop
      } else if (window.innerWidth >= 992) {
        setPostPerPage(8); // Laptop
      } else {
        setPostPerPage(8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  }

  const handleSign = (userID: string) => {
    console.log(userID)
    ApproveUserManagement(userID)
      .then((response) => {
        queryClient.invalidateQueries("usermanagement");
        console.log("회원관리 승인이 완료되었습니다.", response);
      })
      .catch((error) => {
        console.error("회원관리 승인에 실패했습니다.", error);
      });

    setSignModalOpen(false);
  }

  const handleDelete = (userID: string) => {
    DeleteUserManagement(userID)
      .then((response) => {
        queryClient.invalidateQueries("usermanagement");
        console.log("회원관리 삭제가 완료되었습니다.", response);
      })
      .catch((error) => {
        console.error("회원관리 삭제에 실패했습니다.", error);
      });

    setDelModalOpen(false);
  };

  const handleEdit = (userID: string) => {
    console.log("탈퇴 사용자:", userID);
    EditChainLinker(userID)
      .then((response) => {
        queryClient.invalidateQueries("usermanagement");
        console.log("회원 탈퇴 완료", response);
      })
      .catch((error) => {
        console.error("회원 탈퇴 실패", error);
      });

    setDelModalOpen(false);
  };


  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    company: '',
    department: '',
    team: '',
    spot: '',
    position: '',
    phoneNumber: '',
    password: ''
});
const [isDepart, setIsDepart] = useState(false);
const [isTeam, setIsTeam] = useState(false);
const [isSpot, setIsSpot] = useState(false);
const [isPosition, setIsPosition] = useState(false);

  const handleOptionClick = (optionName: any, optionValue: any) => {
    setSelectedOptions(prevState => ({
        ...prevState,
        [optionName]: optionValue
    }));

    if (optionName === 'company') {
        setSelectedOptions(prevState => ({
            ...prevState,
            department: '',
            team: ''
        }));
        setIsDepart(false);
        setIsTeam(false);
    }

    setIsTeam(false);
    setIsDepart(false);
    setIsSpot(false);
    setIsPosition(false);
};
const toggleSelect = (dropdownIndex: any) => {
  switch (dropdownIndex) {
      case 1:
          setIsDepart(!isDepart);
          setIsTeam(false);
          setIsSpot(false);
          setIsPosition(false);
          break;
      case 2:
          setIsTeam(!isTeam);
          setIsDepart(false);
          setIsSpot(false);
          setIsPosition(false);
          break;
      case 3:
          setIsSpot(!isSpot);
          setIsDepart(false);
          setIsTeam(false);
          setIsPosition(false);
          break;
      case 4:
          setIsPosition(!isPosition);
          setIsDepart(false);
          setIsTeam(false);
          setIsSpot(false);
          break;
      default:
          break;
  }
};

const renderTeams = () => {
  switch (selectedOptions.department) {
      case '알고리즘 연구실':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '암호 연구팀')}>암호 연구팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', 'AI 연구팀')}>AI 연구팀</div>
              </>
          );
      case '동형분석 연구실':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '동형분석 연구팀')}>동형분석 연구팀</div>
              </>
          );
      case '블록체인 연구실':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '크립토 블록체인 연구팀')}>크립토 블록체인 연구팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', 'API 개발팀')}>API 개발팀</div>
              </>
          );
      case '개발부':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '개발 1팀')}>개발 1팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', '개발 2팀')}>개발 2팀</div>
              </>
          );
      case '관리부':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '관리팀')}>관리팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', '지원팀')}>지원팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', '시설팀')}>시설팀</div>
              </>
          );
      case '마케팅부':
          return (
              <>
                  <div className="op" onClick={() => handleOptionClick('team', '디자인팀')}>디자인팀</div>
                  <div className="op" onClick={() => handleOptionClick('team', '기획팀')}>기획팀</div>
              </>
          );
      default:
          return null;
  }
};

  return (
    <div className="content">
      <div className="content_container">
        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[0]} marginTop={tabMargins[0]}>가입승인</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[1]} marginTop={tabMargins[1]}>회원수정</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)' height={tabHeights[2]} marginTop={tabMargins[2]}>회원관리</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="UserManage_container">
                <div style={{ marginTop: '50px' }}>
                  <table className="UserManage_approve_board_list">
                    <colgroup>
                      <col width="10%" />
                      <col width="10%" />
                      <col width="35%" />
                      <col width="10%" />
                      <col width="10%" />
                      <col width="15%" />
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
                    <tbody className="board_container">
                      {pendingusermanages
                        .slice((page - 1) * postPerPage, page * postPerPage)
                        .map((usermanage) => (
                          <tr key={usermanage.userID} className="board_content">
                            <td>{usermanage.username}</td>
                            <td>{usermanage.company}</td>
                            <td>{usermanage.department}&nbsp;&nbsp;{usermanage.team}</td>
                            <td>{usermanage.position}</td>
                            <td>{new Date(usermanage.createdAt).toISOString().substring(0, 10)}</td>
                            <td className="flex_center">
                              <button className="white_button" onClick={() => { setSignModalOpen(true); setClickIdx(usermanage.userId) }}>승인</button>
                              <button className="red_button" onClick={() => { setDelModalOpen(true); setClickIdx(usermanage.userId) }}>삭제</button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <div className="UserManage_bottom">
                    <Pagination
                      activePage={page}
                      itemsCountPerPage={postPerPage}
                      totalItemsCount={pendingusermanages.length}
                      pageRangeDisplayed={Math.ceil(pendingusermanages.length / postPerPage)}
                      prevPageText={<LeftIcon />}
                      nextPageText={<RightIcon />}
                      firstPageText={<FirstLeftIcon />}
                      lastPageText={<LastRightIcon />}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="UserManage_container">
                <div style={{ marginTop: '50px' }}>
                  <table className="UserManage_board_list">
                    <colgroup>
                      <col width="10%" />
                      <col width="10%" />
                      <col width="35%" />
                      <col width="10%" />
                      <col width="10%" />
                      <col width="15%" />
                    </colgroup>
                    <thead>
                      <tr className="board_header">
                        <th>성명</th>
                        <th>회사구분</th>
                        <th>부서</th>
                        <th>직위/직책</th>
                        <th>입사일</th>
                        <th>회원수정</th>
                      </tr>
                    </thead>
                    <tbody className="board_container">
                      {approvedusermanages
                        .slice((page - 1) * postPerPage, page * postPerPage)
                        .map((usermanage) => (
                          <tr key={usermanage.userID} className="board_content">
                            <td>{usermanage.username}</td>
                            <td>{usermanage.company}</td>
                            <td>{usermanage.department}&nbsp;&nbsp;{usermanage.team}</td>
                            <td>{usermanage.position}</td>
                            <td>{new Date(usermanage.entering).toISOString().substring(0, 10)}</td>
                            <td className="TdContain">
                              <button
                                className="white_button"
                                onClick={() => {
                                  setEditModalOpen(true);
                                  setClickIdx(usermanage.userId);
                                }}
                              >
                                수정
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>

                  </table>
                  <div className="UserManage_bottom">
                    <Pagination
                      activePage={page}
                      itemsCountPerPage={postPerPage}
                      totalItemsCount={approvedusermanages.length}
                      pageRangeDisplayed={Math.ceil(approvedusermanages.length / postPerPage)}
                      prevPageText={<LeftIcon />}
                      nextPageText={<RightIcon />}
                      firstPageText={<FirstLeftIcon />}
                      lastPageText={<LastRightIcon />}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>

            <TabPanel>
              <div className="UserManage_container">
                <div style={{ marginTop: '50px' }}>
                  <table className="UserManage_board_list">
                    <colgroup>
                      <col width="10%" />
                      <col width="10%" />
                      <col width="35%" />
                      <col width="10%" />
                      <col width="10%" />
                      <col width="15%" />
                    </colgroup>
                    <thead>
                      <tr className="board_header">
                        <th>성명</th>
                        <th>회사구분</th>
                        <th>부서</th>
                        <th>직위/직책</th>
                        <th>입사일</th>
                        <th>탈퇴</th>
                      </tr>
                    </thead>
                    <tbody className="board_container">
                      {approvedusermanages
                        .slice((page - 1) * postPerPage, page * postPerPage)
                        .map((usermanage) => (
                          <tr key={usermanage.userID} className="board_content">
                            <td>{usermanage.username}</td>
                            <td>{usermanage.company}</td>
                            <td>{usermanage.department}&nbsp;&nbsp;{usermanage.team}</td>
                            <td>{usermanage.position}</td>
                            <td>{new Date(usermanage.entering).toISOString().substring(0, 10)}</td>
                            <td className="TdContain">
                              <button
                                className="red_button"
                                onClick={() => {
                                  setDelModalOpen(true);
                                  setClickIdx(usermanage.userId);
                                  handleEdit(usermanage.userId)
                                }}
                              >
                                탈퇴
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>

                  </table>
                  <div className="UserManage_bottom">
                    <Pagination
                      activePage={page}
                      itemsCountPerPage={postPerPage}
                      totalItemsCount={approvedusermanages.length}
                      pageRangeDisplayed={Math.ceil(approvedusermanages.length / postPerPage)}
                      prevPageText={<LeftIcon />}
                      nextPageText={<RightIcon />}
                      firstPageText={<FirstLeftIcon />}
                      lastPageText={<LastRightIcon />}
                      onChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      <CustomModal
        isOpen={isSignModalOpen}
        onClose={() => setSignModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="green-btn"
        onFooter1Click={() => handleSign(clickIdx)}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setSignModalOpen(false)}
      >
        <div>
          승인하시겠습니까?
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isDelModalOpen}
        onClose={() => setDelModalOpen(false)}
        header={'알림'}
        footer1={'확인'}
        footer1Class="red-btn"
        onFooter1Click={() => handleDelete(clickIdx)}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setDelModalOpen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>

      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        header={'회원수정'}
        footer1={'확인'}
        footer1Class="red-btn"
        onFooter1Click={() => setEditModalOpen(false)}
        footer2={'취소'}
        footer2Class="gray-btn"
        onFooter2Click={() => setEditModalOpen(false)}
        width="auto"
        height="auto"
      >
        <div className="Edit_modal_container">
          <div className="flexbox">
            <span className="FlexSpan">회사</span>
            <fieldset>
                <label>
                    <input type="radio" name="company" value="R&D" onClick={() => handleOptionClick('company', 'R&D')} />
                    <span>R&D</span>
                </label>

                <label>
                    <input type="radio" name="company" value="본사" onClick={() => handleOptionClick('company', '본사')} />
                    <span>본사</span>
                </label>
            </fieldset>
        </div>
        <div className="flexbox">
            <span className="FlexSpan">부서</span>
            <div className="custom-select">
                <div className="select-header" onClick={() => toggleSelect(1)}>
                    <span>{selectedOptions.department ? selectedOptions.department : '부서를 선택해주세요'}</span>
                    <img src={isDepart ? ArrowUp : ArrowDown} alt="Arrow" />
                </div>
                {isDepart && (
                    <div className="options">
                        {selectedOptions.company === 'R&D' ? (
                            <>
                                <div className="op" onClick={() => handleOptionClick('department', '알고리즘 연구실')}>알고리즘 연구실</div>
                                <div className="op" onClick={() => handleOptionClick('department', '동형분석 연구실')}>동형분석 연구실</div>
                                <div className="op" onClick={() => handleOptionClick('department', '블록체인 연구실')}>블록체인 연구실</div>
                            </>
                        ) : (
                            <>
                                <div className="op" onClick={() => handleOptionClick('department', '개발부')}>개발부</div>
                                <div className="op" onClick={() => handleOptionClick('department', '관리부')}>관리부</div>
                                <div className="op" onClick={() => handleOptionClick('department', '마케팅부')}>마케팅부</div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </div>
        <div className="flexbox">
            <span className="FlexSpan">팀</span>
            <div className="custom-select">
                <div className="select-header" onClick={() => toggleSelect(2)}>
                    <span>{selectedOptions.team ? selectedOptions.team : '팀을 선택해주세요'}</span>
                    <img src={isTeam ? ArrowUp : ArrowDown} alt="Arrow" />
                </div>
                {isTeam && (
                    <div className="options">
                        {renderTeams()}
                    </div>
                )}
            </div>
        </div>
        <div className="flexbox">
            <span className="FlexSpan">직위</span>
            <div className="custom-select">
                <div className="select-header" onClick={() => toggleSelect(3)}>
                    <span>{selectedOptions.spot ? selectedOptions.spot : '직위를 선택해주세요'}</span>
                    <img src={isSpot ? ArrowUp : ArrowDown} alt="Arrow" />
                </div>
                {isSpot && (
                    <div className="options">
                        <div className="op" onClick={() => handleOptionClick('spot', '사원')}>사원</div>
                        <div className="op" onClick={() => handleOptionClick('spot', '책임')}>책임</div>
                        <div className="op" onClick={() => handleOptionClick('spot', '수석')}>수석</div>
                        <div className="op" onClick={() => handleOptionClick('spot', '상무')}>상무</div>
                        <div className="op" onClick={() => handleOptionClick('spot', '전무')}>전무</div>
                        <div className="op" onClick={() => handleOptionClick('spot', '대표이사')}>대표이사</div>
                    </div>
                )}
            </div>
        </div>
        <div className="flexbox">
            <span className="FlexSpan">직책</span>
            <div className="custom-select">
                <div className="select-header" onClick={() => toggleSelect(4)}>
                    <span>{selectedOptions.position ? selectedOptions.position : '직책을 선택해주세요'}</span>
                    <img src={isPosition ? ArrowUp : ArrowDown} alt="Arrow" />
                </div>
                {isPosition && (
                    <div className="options">
                        {selectedOptions.company === 'R&D' ? (
                            <>
                                <div className="op" onClick={() => handleOptionClick('position', '연구원')}>연구원</div>
                                <div className="op" onClick={() => handleOptionClick('position', '팀장')}>팀장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '연구실장')}>연구실장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '센터장')}>센터장</div>
                            </>
                        ) : (
                            <>
                                <div className="op" onClick={() => handleOptionClick('position', '사원')}>사원</div>
                                <div className="op" onClick={() => handleOptionClick('position', '팀장')}>팀장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '부서장')}>부서장</div>
                                <div className="op" onClick={() => handleOptionClick('position', '이사')}>이사</div>
                                <div className="op" onClick={() => handleOptionClick('position', '대표이사')}>대표이사</div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default UserManagement;