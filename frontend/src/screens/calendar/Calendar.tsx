import "./Calendar.scss";
import { Link } from "react-router-dom";

const Calendar = () => {

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/calendar"} className="sub_header">휴가관리</Link>
      </div>
      
      <div className="content_container">
        <div className="calendar_container">
          
        </div>  
      </div>  
    </div>
  );
};

export default Calendar;