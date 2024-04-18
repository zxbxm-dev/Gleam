import { Link } from "react-router-dom";



const HumanResource = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/human-resources"} className="sub_header">인사 정보 관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default HumanResource;