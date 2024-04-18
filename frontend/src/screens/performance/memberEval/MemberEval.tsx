import { Link } from "react-router-dom";


const MemberEval = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/member-evaluation"} className="sub_header">팀원 평가표</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default MemberEval;