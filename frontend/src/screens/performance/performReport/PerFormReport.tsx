import { Link } from "react-router-dom";


const PerFormReport = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/performance-report"} className="sub_header">성과보고서</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default PerFormReport;