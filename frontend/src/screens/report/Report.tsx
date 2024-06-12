import "./Report.scss";
import { useNavigate, Link } from "react-router-dom";

const reportCategories = [
  {
    title: "공동",
    reports: ["주간업무일지", "휴가신청서", "지출품의서"],
  },
  {
    title: "프로젝트",
    reports: [
      "기획서",
      "중간보고서",
      "최종보고서",
      "TF팀 기획서",
      "TF팀 프로젝트 계획서",
"TF팀 중간보고서",
"TF팀 프로젝트 결과 보고서",
"박람회 보고서"
    ],
  },
  {
    title: "인사",
    reports: [
      "휴직원",
      "복직원",
      "시말서",
      "진급추천서",
      "퇴직금 중간정산 신청서",
    ],
  },
  {
    title: "총무",
    reports: [
      "출장 신청서",
      "출장 보고서",
      "자기개발비 신청서",
      "법인카드 신청서",
      "지출내역서",
      "예산신청서"
    ],
  },
  {
    title: "기타",
    reports: [
      "워크숍 신청서",
      "야유회 보고서",
      "프로젝트 회의 보고서"
    ],
  },
];

const Report = () => {
  const navigate = useNavigate();

  const handleReportClick = (reportName:any) => {
    navigate("/writeReport", { state: { reportName } });
  };

  const renderReports = (category:any) => (
    <div className="report_content" key={category.title}>
      <div className="report_title">{category.title}</div>
      {category.reports.map((report:any) => (
        <div
          className="report_name"
          key={report}
          onClick={() => handleReportClick(report)}
        >
          {report}
        </div>
      ))}
    </div>
  );

  return (
    <div className="content">
      <div className="content_header">
        <Link to="/report" className="sub_header">보고서</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="report_container">
            {reportCategories.map((category) => (
              <div className="report_type" key={category.title}>
                {renderReports(category)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
