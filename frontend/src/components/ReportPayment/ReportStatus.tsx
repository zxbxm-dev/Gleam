import React from "react";

const ReportStatus = ({
  selectedTab,
  mydocuments,
  approvalings,
  inProgress,
  rejecteds,
  compleDocuments,
  setSelectedReport,
  setSelectedTab,
  SelectOptions,
}: any) => {
  const handleTabClick = (tab: string) => {
    setSelectedReport("전체 문서");
    SelectOptions("전체 문서");
    setSelectedTab(tab);
  };
  return (
    <div className="approval_top_first">
      <div
        className={`${
          selectedTab === "approval" ? "approval_tab_clicked" : "approval_tab"
        }`}
        onClick={() => handleTabClick("approval")}
      >
        <span>대기</span>{" "}
        <span className="document_count">{approvalings?.length}</span>
      </div>
      <div
        className={`${
          selectedTab === "inProgress" ? "approval_tab_clicked" : "approval_tab"
        }`}
        onClick={() => handleTabClick("inProgress")}
      >
        <span>진행</span>{" "}
        <span className="document_count">{inProgress?.length}</span>
      </div>

      <div
        className={`${
          selectedTab === "completed" ? "approval_tab_clicked" : "approval_tab"
        }`}
        onClick={() => handleTabClick("completed")}
      >
        <span>완료</span>{" "}
        <span className="document_count">{compleDocuments?.length}</span>
      </div>
      <div
        className={`${
          selectedTab === "rejected" ? "approval_tab_clicked" : "approval_tab"
        }`}
        onClick={() => handleTabClick("rejected")}
      >
        <span>참조</span>{" "}
        <span className="document_count">{rejecteds?.length}</span>
      </div>
    </div>
  );
};

export default ReportStatus;
