import { Link } from "react-router-dom";


const FinalResult = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/final-result"} className="sub_header">최종 결과 확인</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default FinalResult;