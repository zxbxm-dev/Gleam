import "./Report.scss";
import { Link } from "react-router-dom";
import { Select } from '@chakra-ui/react';

const WriteReport = () => {

  return (
    <div className="content">
      <div className="content_header">
        <Link to={"/report"} className="sub_header">보고서</Link>
      </div>
      
      <div className="content_container">
        <div className="container">
          <div className="write_container">
            <div className="write_top_container">
              <div className="top_left_content">
                <div className="sub_title">양식 선택</div>
                <Select size='md' width='380px' borderRadius='5px' fontFamily='var(--font-family-Noto-M)'>
                  <option value='' disabled style={{fontFamily: 'var(--font-family-Noto-B)'}}>공통보고서</option>
                  <option value=''>&nbsp;&nbsp; 주간업무일지</option>
                  <option value=''>&nbsp;&nbsp; 지출품의서</option>
                  <option value=''>&nbsp;&nbsp; 휴가신청서</option>

                  <option value='' disabled style={{fontFamily: 'var(--font-family-Noto-B)'}}>워크숍</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 신청서</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 보고서 (프로젝트 회의)</option>
                  <option value=''>&nbsp;&nbsp; 워크숍 보고서 (야유회)</option>
                  <option value=''>&nbsp;&nbsp; 지출내역서</option>
                  <option value=''>&nbsp;&nbsp; 예산신청서 (지원팀)</option>

                  <option value='' disabled style={{fontFamily: 'var(--font-family-Noto-B)'}}>기획서</option>
                  <option value=''>&nbsp;&nbsp; 기획서</option>
                  <option value=''>&nbsp;&nbsp; 최종보고서</option>

                  <option value='' disabled style={{fontFamily: 'var(--font-family-Noto-B)'}}>기타</option>
                  <option value=''>&nbsp;&nbsp; 시말서</option>
                  <option value=''>&nbsp;&nbsp; 사직서</option>
                  <option value=''>&nbsp;&nbsp; 휴직원</option>
                  <option value=''>&nbsp;&nbsp; 복직원</option>
                </Select>
              </div>

              <div className="top_right_content">
                <button className="approval_button">결제라인 선택</button>
                <button className="save_button">임시저장</button>
                <button className="upload_button">파일 업로드</button>
              </div>
            </div>

            <div className="write_btm_container">
              하단
            </div>
          </div>
        </div>
      </div>  
      
    </div>
  );
};

export default WriteReport;