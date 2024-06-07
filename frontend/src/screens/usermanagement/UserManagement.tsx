import "./UserManagement.scss";
import { useState } from "react";
import { ReactComponent as RightIcon } from "../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../assets/images/Common/FirstLeftIcon.svg";
import { Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import CustomModal from "../../components/modal/CustomModal";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

import { useQueryClient, useQuery } from "react-query";
import { CheckUserManagement, ApproveUserManagement, DeleteUserManagement, EditChainLinker } from "../../services/usermanagement/UserManagementServices";

const UserManagement = () => {
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const [pendingusermanages, setPendingUserManages] = useState<any[]>([]);
  const [approvedusermanages, setApprovedUserManages] = useState<any[]>([]);
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [isDelModalOpen, setDelModalOpen] = useState(false);
  const postPerPage: number = 10;
  const [activeTab, setActiveTab] = useState(0);
  const [clickIdx, setClickIdx] = useState<string>('');

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

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/employment"} className="sub_header">회원관리</Link>
      </div>

      <div className="content_container">

        <Tabs variant='enclosed' onChange={(index) => setActiveTab(index)}>
          <TabList>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>가입승인</Tab>
            <Tab _selected={{ bg: '#FFFFFF', fontFamily: 'var(--font-family-Noto-B)' }} bg='#DEDEDE' borderTop='1px solid #DEDEDE' borderRight='1px solid #DEDEDE' borderLeft='1px solid #DEDEDE' fontFamily='var(--font-family-Noto-R)'>회원관리</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <div className="UserManage_container">
                <div style={{ marginTop: '50px' }}>
                  <table className="regulation_board_list">
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
                    <tbody>
                      {pendingusermanages
                        .slice((page - 1) * postPerPage, page * postPerPage)
                        .map((usermanage) => (
                          <tr key={usermanage.userID} className="board_content">
                            <td>{usermanage.username}</td>
                            <td>{usermanage.company}</td>
                            <td>{usermanage.department}</td>
                            <td>{usermanage.position}</td>
                            <td>{usermanage.createdAt}</td>
                            <td>
                              <button className="edits_button" onClick={() => { setSignModalOpen(true); setClickIdx(usermanage.userId) }}>승인</button>
                              <button className="dels_button" onClick={() => { setDelModalOpen(true); setClickIdx(usermanage.userId) }}>삭제</button>
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
                  <table className="regulation_board_list">
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
                    <tbody>
                      {approvedusermanages
                        .slice((page - 1) * postPerPage, page * postPerPage)
                        .map((usermanage) => (
                          <tr key={usermanage.userID} className="board_content">
                            <td>{usermanage.username}</td>
                            <td>{usermanage.company}</td>
                            <td>{usermanage.department}</td>
                            <td>{usermanage.position}</td>
                            <td>{usermanage.entering}</td>
                            <td>
                              <button
                                className="dels_button"
                                onClick={() => {
                                  setDelModalOpen(true);
                                  setClickIdx(usermanage.userId);
                                  handleEdit(usermanage.userId);
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
        footer2={'취소'}
        onFooter1Click={() => handleDelete(clickIdx)}
        footer2Class="gray-btn"
        onFooter2Click={() => setDelModalOpen(false)}
      >
        <div>
          삭제하시겠습니까?
        </div>
      </CustomModal>
    </div>
  );
};

export default UserManagement;