import { Link } from "react-router-dom";



const AnnualManage = () => {
  

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">근태관리</div>
        <div className="main_header">＞</div>
        <Link to={"/annual-manage"} className="sub_header">연차관리</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          
        </div>
      </div>  
      
    </div>
  );
};

export default AnnualManage;