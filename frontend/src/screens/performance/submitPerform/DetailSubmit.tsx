import "../Performance.scss";
import { Link } from "react-router-dom";


const SubmitPerform = () => {


  return (
    <div className="content">
      <div className="content_header" style={{ justifyContent: 'space-between' }}>
        <Link to={"/submitPerform"} className="sub_header">인사평가 제출</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
 

        </div>
      </div>  
      
    </div>
  );
};

export default SubmitPerform;