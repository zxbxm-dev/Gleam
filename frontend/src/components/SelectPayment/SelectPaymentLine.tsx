import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import HrSidebar from "../sidebar/HrSidebar";
import { useRecoilValue } from "recoil";
import { userState } from "../../recoil/atoms";
import { Member } from "../../screens/report/WriteReport";
import {
  Approval_Minus,
  Approval_Plus,
  NewCloseIcon,
} from "../../assets/images";
import { PersonData } from "../../services/person/PersonServices";
import { Person } from "../sidebar/MemberSidebar";

interface SelectPaymentLineProps {
  editReferOpen: boolean;
  setEditReferOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SelectPaymentLine: React.FC<SelectPaymentLineProps> = ({
  editReferOpen,
  setEditReferOpen,
}) => {
  const user = useRecoilValue(userState);
  const [personData, setPersonData] = useState<Member[]>([]); //전체데이터
  const [headOffice, setHeadOffice] = useState<Member[]>([]); //본사데이터
  const [RDOffice, setRDOffice] = useState<Member[]>([]); //R&D데이터
  const [selectedApproval, setSelectedApproval] = useState("");

  const [approvalLines, setApprovalLines] = useState([
    { name: "참조", checked: false, selectedMembers: [] as Member[] },
    { name: "대표이사", checked: false, selectedMember: null as Member | null },
    {
      name: "결재라인 1",
      checked: false,
      selectedMember: null as Member | null,
    },
    {
      name: "결재라인 2",
      checked: false,
      selectedMember: null as Member | null,
    },
    {
      name: "결재라인 3",
      checked: false,
      selectedMember: null as Member | null,
    },
    {
      name: "결재라인 4",
      checked: false,
      selectedMember: null as Member | null,
    },
    {
      name: "결재라인 5",
      checked: false,
      selectedMember: null as Member | null,
    },
  ]);

  useEffect(() => {
    const allMemberdeparmentOrder = [
      "포체인스 주식회사",
      "연구 총괄",
      "관리부",
      "개발부",
      "마케팅부",
      "알고리즘 연구실",
      "동형분석 연구실",
      "블록체인 연구실",
    ];
    const allMemberTeamOrder = ["개발 1팀", "개발 2팀"];
    const HeaddepartmentOrder = [
      "포체인스 주식회사",
      "관리부",
      "개발부",
      "마케팅부",
    ];
    const RDdepartmentOrder = [
      "포체인스 주식회사",
      "연구 총괄",
      "알고리즘 연구실",
      "동형분석 연구실",
      "블록체인 연구실",
    ];

    const sortByAllDepartment = (a: string, b: string) => {
      const indexA = allMemberdeparmentOrder.indexOf(a[1]);
      const indexB = allMemberdeparmentOrder.indexOf(b[1]);

      if (indexA !== indexB) {
        return indexA - indexB;
      }

      const teamIndexA = allMemberTeamOrder.indexOf(a[2]);
      const teamIndexB = allMemberTeamOrder.indexOf(b[2]);

      if (teamIndexA !== -1 && teamIndexB !== -1 && teamIndexA !== teamIndexB) {
        return teamIndexA - teamIndexB;
      }

      if (!a[2] && b[2]) {
        return -1;
      }
      if (a[2] && !b[2]) {
        return 1;
      }

      const hireDateA = new Date(a[4]);
      const hireDateB = new Date(b[4]);

      if (hireDateA < hireDateB) {
        return -1;
      }
      if (hireDateA > hireDateB) {
        return 1;
      }

      return 0;
    };

    const sortByHeadDepartment = (a: string, b: string) => {
      const indexA = HeaddepartmentOrder.indexOf(a[1]);
      const indexB = HeaddepartmentOrder.indexOf(b[1]);

      if (indexA !== indexB) {
        return indexA - indexB;
      }

      const teamIndexA = allMemberTeamOrder.indexOf(a[2]);
      const teamIndexB = allMemberTeamOrder.indexOf(b[2]);

      if (teamIndexA !== -1 && teamIndexB !== -1 && teamIndexA !== teamIndexB) {
        return teamIndexA - teamIndexB;
      }

      if (!a[2] && b[2]) {
        return -1;
      }
      if (a[2] && !b[2]) {
        return 1;
      }

      const hireDateA = new Date(a[4]);
      const hireDateB = new Date(b[4]);

      if (hireDateA < hireDateB) {
        return -1;
      }
      if (hireDateA > hireDateB) {
        return 1;
      }

      return 0;
    };

    const sortByRdDepartment = (a: string, b: string) => {
      const indexA = RDdepartmentOrder.indexOf(a[1]);
      const indexB = RDdepartmentOrder.indexOf(b[1]);

      if (indexA !== indexB) {
        return indexA - indexB;
      }

      if (!a[2] && b[2]) {
        return -1;
      }
      if (a[2] && !b[2]) {
        return 1;
      }

      return 0;
    };

    const fetchData = async () => {
      try {
        const response = await PersonData();
        const approvedUsers = response.data.filter(
          (item: any) => item.status === "approved"
        );

        const formatUserData = (user: Person) => {
          let department = user.department;

          if (user.position === "대표이사" || user.position === "이사") {
            department = "포체인스 주식회사";
          } else if (user.position === "센터장") {
            department = "연구 총괄";
          }

          return [
            user.username,
            department,
            user.team || "",
            user.position,
            user.assignPosition,
          ];
        };

        const formattedApprovedUsers = approvedUsers
          .map(formatUserData)
          .sort(sortByAllDepartment);
        setPersonData(formattedApprovedUsers);

        const headOfficeUsers = approvedUsers.filter(
          (item: any) => !item.company || item.company === "본사"
        );
        const sortedHeadOfficeData = headOfficeUsers
          .map(formatUserData)
          .sort(sortByHeadDepartment);
        setHeadOffice(sortedHeadOfficeData);

        const rdOfficeUsers = approvedUsers.filter(
          (item: any) => !item.company || item.company === "R&D"
        );
        const sortedRDOfficeData = rdOfficeUsers
          .map(formatUserData)
          .sort(sortByRdDepartment);
        setRDOffice(sortedRDOfficeData);
      } catch (err) {
        console.error("Error fetching person data:", err);
      }
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updatedApprovalLines = [...approvalLines];
    updatedApprovalLines.forEach((line, idx) => {
      if (idx === index) {
        line.checked = !line.checked;
        if (line.selectedMember) {
          line.selectedMember = null;
        } else if (line.selectedMembers) {
          line.selectedMembers = [];
        }
      } else {
        if (
          !line.selectedMember &&
          (!line.selectedMembers || line.selectedMembers.length === 0)
        ) {
          line.checked = false;
        }
      }
    });
    setSelectedApproval(updatedApprovalLines[index].name);
    setApprovalLines(updatedApprovalLines);
  };

  const handleMemberClick = (
    name: string,
    dept: string,
    team: string,
    position: string,
    lineName: string,
    approvalFixed: string
  ) => {
    // 선택된 멤버 정보를 새로운 Member 배열로 생성
    const newMember: Member = [name, dept, team, position, approvalFixed];

    // approvalLines 배열을 복사하여 새로운 배열 생성
    const updatedApprovalLines = [...approvalLines];

    // lineName에 해당하는 결재 라인의 인덱스 찾기
    const index = updatedApprovalLines.findIndex(
      (line) => line.name === lineName
    );

    if (index !== -1) {
      if (lineName === "참조") {
        // 참조 라인인 경우, 중복 체크 후 중복되지 않은 경우에만 추가
        const existingMembers = updatedApprovalLines[index].selectedMembers;
        if (existingMembers) {
          const isDuplicate = existingMembers.some(
            (member) =>
              member[0] === name &&
              member[1] === dept &&
              member[2] === team &&
              member[3] === position
          );
          if (!isDuplicate) {
            (
              updatedApprovalLines[index] as {
                name: string;
                checked: boolean;
                selectedMembers: Member[];
              }
            ).selectedMembers.push(newMember);
          }
        } else {
          // selectedMembers가 비어있을 경우, 새로운 배열로 초기화하여 추가
          updatedApprovalLines[index].selectedMembers = [newMember];
        }
      } else {
        // 그 외의 경우에는 기존 로직과 동일하게 처리
        updatedApprovalLines[index].selectedMember = newMember;
      }

      // 새로운 배열을 상태로 설정
      setApprovalLines(updatedApprovalLines);
    } else {
      console.error(`결재 라인 "${lineName}"을 찾을 수 없습니다.`);
    }
  };

  const handleNameChange = (index: number, newName: string) => {
    const updatedApprovalLines = [...approvalLines];
    updatedApprovalLines[index].name = newName;
    setApprovalLines(updatedApprovalLines);
  };

  // 결재라인 삭제 함수
  const removeApprovalLine = (index: number) => {
    if (approvalLines.length > 1) {
      const updatedLines = approvalLines.filter((line, i) => i !== index);
      setApprovalLines(updatedLines);
    }
  };

  // 결재라인 추가 함수
  const addApprovalLine = () => {
    if (approvalLines.length <= 6) {
      const newLineNumber =
        approvalLines.filter((line) => line.name.startsWith("결재라인"))
          .length + 1;
      const newLine = {
        name: `결재라인 ${newLineNumber}`,
        checked: false,
        selectedMember: null as Member | null,
      };
      setApprovalLines([...approvalLines, newLine]);
    }
  };

  // 멤버 삭제 함수
  const handleRemoveMember = (indexToRemove: number) => {
    const updatedApprovalLines = [...approvalLines];
    if (updatedApprovalLines[0].selectedMembers !== undefined) {
      updatedApprovalLines[0].selectedMembers.splice(indexToRemove, 1);
      setApprovalLines(updatedApprovalLines);
    }
  };

  const handleClose = () => {
    setEditReferOpen(false);
  };

  const handleSubmit = () => {
    // 여기 결재라인 참고자 변경 예정
    setEditReferOpen(false);
  };

  return (
    <Popover
      placement="left-start"
      isOpen={editReferOpen}
      onClose={() => {
        setEditReferOpen(false);
      }}
    >
      <Portal>
        <PopoverContent className="approval_popover_content">
          <PopoverHeader className="approval_popover_header">
            참조자 변경
          </PopoverHeader>
          {/* <PopoverCloseButton className="approval_popover_header_close" onClick={onApprovalModalClose}/> */}
          <PopoverBody className="approval_popover_body">
            <div className="approval_popover_memberside">
              {user.company === "본사" ? (
                <HrSidebar
                  members={headOffice}
                  onClickMember={(name, dept, team, position, assignPosition) =>
                    handleMemberClick(
                      name,
                      dept,
                      team,
                      position,
                      selectedApproval,
                      assignPosition
                    )
                  }
                />
              ) : user.company === "R&D" ? (
                <HrSidebar
                  members={RDOffice}
                  onClickMember={(name, dept, team, position, assignPosition) =>
                    handleMemberClick(
                      name,
                      dept,
                      team,
                      position,
                      selectedApproval,
                      assignPosition
                    )
                  }
                />
              ) : (
                <HrSidebar
                  members={personData}
                  onClickMember={(name, dept, team, position, assignPosition) =>
                    handleMemberClick(
                      name,
                      dept,
                      team,
                      position,
                      selectedApproval,
                      assignPosition
                    )
                  }
                />
              )}
            </div>
            <div className="FlexContentBox">
              {approvalLines
                .filter((line) => line.name === "참조")
                .map((line, index) => (
                  <div key={index} className="last_approval_content">
                    <div className="approval_line">
                      <input
                        type="checkbox"
                        checked={line.checked}
                        onChange={() => handleCheckboxChange(index)}
                        className="approval_checkbox"
                        id="chk"
                        style={{ cursor: "pointer" }}
                      />
                      <label htmlFor="chk" style={{ cursor: "pointer" }}>
                        {line.name}&nbsp;(
                        {line.selectedMembers?.length})
                      </label>
                    </div>
                    {line.checked ? (
                      line.selectedMember ? (
                        <div
                          className="approval_name"
                          onClick={() => handleCheckboxChange(index)}
                        >
                          {/* <img src={UserIcon_dark} alt="UserIcon_dark" className="name_img" /> */}
                          <div className="name_text">
                            {line.selectedMember[0]}
                          </div>
                          {/* <div className='name_border'></div> */}
                          <div className="position_text">
                            {line.selectedMember[3]}
                          </div>
                        </div>
                      ) : line.name === "참조" && line.selectedMembers ? (
                        <div className="approvals_contents">
                          {line.selectedMembers.map((member, index) => (
                            <div key={index} className="approval_small_name">
                              <div className="NameFlex">
                                <div className="position_text">
                                  {member[2] || member[1]}
                                </div>
                                <div className="name_text">{member[0]}</div>
                              </div>
                              <img
                                src={NewCloseIcon}
                                alt="CloseIcon"
                                className="close_btn"
                                onClick={() => handleRemoveMember(index)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={
                            line.checked === true
                              ? "approval_checked"
                              : "approval_unchecked"
                          }
                          onClick={() => handleCheckboxChange(index)}
                        >
                          <div>&nbsp;</div>
                        </div>
                      )
                    ) : (
                      <div
                        className="approval_unchecked"
                        onClick={() => handleCheckboxChange(index)}
                      >
                        칸 선택 후 좌측 리스트에서
                        <br />
                        결재라인을 선택해주세요
                      </div>
                    )}
                  </div>
                ))}

              <div className="button-wrap">
                <button
                  className="second_button"
                  onClick={() => handleSubmit()}
                >
                  변경
                </button>
                <button className="white_button" onClick={handleClose}>
                  취소
                </button>
              </div>
            </div>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default SelectPaymentLine;
