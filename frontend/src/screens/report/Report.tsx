import "./Report.scss";
import { useNavigate, Link } from "react-router-dom";

const reportCategories = [
  {
    title: "공통 보고서",
    reports: ["주간업무일지", "지출품의서", "휴가신청서"],
  },
  {
    title: "기타",
    reports: ["시말서", "휴직원", "복직원"],
  },
  {
    title: "워크숍",
    reports: [
      "워크숍 신청서",
      "워크숍 보고서 (프로젝트 회의)",
      "워크숍 보고서 (야유회)",
      "지출내역서",
      "예산신청서 (지원팀)",
    ],
  },
  {
    title: "기획서",
    reports: ["기획서", "최종보고서", "프로젝트 계획서"],
  },
  {
    title: "기획서",
    reports: ["기획서", "최종보고서", "프로젝트 계획서"],
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
