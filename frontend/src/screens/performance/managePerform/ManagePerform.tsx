import { Link } from "react-router-dom";

const ManagePerform = () => {

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/submitPerform"} className="sub_header">인사평가 관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default ManagePerform;