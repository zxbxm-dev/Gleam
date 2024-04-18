import { Link } from "react-router-dom";


const SelfAssessment = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/self-assessment"} className="sub_header">자기신고서</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default SelfAssessment;