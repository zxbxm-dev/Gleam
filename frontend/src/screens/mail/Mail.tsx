import { 
  mail_calendar, 
  mail_delete, 
  mail_download, 
  mail_important, 
  mail_important_active, 
  mail_setting, 
  mail_spam, 
  mail_write,
  mail_attachment,
  mail_triangle,
  White_Arrow,
  SearchIcon,
 } from "../../assets/images/index";
import { useState } from "react";

const Mail = () => {
  const [settingVisible, setSettingVisible] = useState(false);
  const [mailcontentVisible, setMailContentVisible] = useState(false);

  const toggleSetting = () => {
    setSettingVisible(!settingVisible);
  };

  const toggleMailContent = () => {
    setMailContentVisible(!mailcontentVisible);
  }


  return (
    <div className="content">
      <div className="mail_container">
        <div className="mail_header">
          <div className="mail_header_left">
            <label className="custom-checkbox">
              <input type="checkbox" id="check1" />
              <span></span>
            </label>
            <img src={mail_delete} alt="mail_delete" />
            <img src={mail_spam} alt="mail_spam" />
            <img src={mail_write} alt="mail_write" />
          </div>

          <div className="mail_header_right">
            <div className={`setting_box ${settingVisible ? 'visible' : ''}`} onClick={toggleSetting}>
              {settingVisible ? (
                <>
                  <img src={mail_setting} alt="mail_setting" />
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_right"/>
                </>
              ) : (
                <>
                  <img src={White_Arrow} alt="White_Arrow" className="Arrow_left"/>
                  <img src={mail_setting} alt="mail_setting" />
                </>
              )}
            </div>
            <div className={`addtional_setting ${settingVisible ? 'visible' : ''}`}>
              <div className="input-wrapper">
                <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
                <input
                  type="search"
                  className="input_form"
                  placeholder="검색어를 입력해 주세요."
                />
              </div>
              <button className={`spam_button`}>스팸 설정</button>
              <button className={`card_button`}>모바일 명함</button>
              <div className="select_duedate_box">
                <span>기간</span>
                <img src={White_Arrow} alt="White_Arrow" />
              </div>
            </div>
            <div className="select_box">
              <span>전체 메일</span>
              <img src={White_Arrow} alt="White_Arrow" />
            </div>
          </div>
        </div>

        <div className="mail_content">
          <table className="mail_board_list">
            <colgroup>
              <col width="3%"/>
              <col width="15%"/>
              <col width="67%"/>
              <col width="13%"/>
            </colgroup>
            <thead>
              <tr className="board_header">
                <th></th>
                <th>보낸 사람</th>
                <th>제목</th>
                <th>날짜</th>
              </tr>
            </thead>
            <tbody className="board_container">
              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발 1팀 구민석</td>
                <td>
                  <div>
                    <img src={mail_important_active} alt="mail_important_active" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    2024년 5월 급여명세서 보내드립니다.
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle"/>
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    홈페이지 조직도 관련 안내
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    개발 1팀 업무 설정 보고
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    개발 1팀 업무 설정 보고
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    개발 1팀 업무 설정 보고
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    개발 1팀 업무 설정 보고
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발부 진유빈</td>
                <td>
                  <div>
                    <img src={mail_important} alt="mail_important" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    개발 1팀 업무 설정 보고
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" />
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발 1팀 구민석</td>
                <td>
                  <div>
                    <img src={mail_important_active} alt="mail_important_active" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    2024년 5월 급여명세서 보내드립니다.
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle"/>
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>
              

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발 1팀 구민석</td>
                <td>
                  <div>
                    <img src={mail_important_active} alt="mail_important_active" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    2024년 5월 급여명세서 보내드립니다.
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle"/>
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>
              
              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발 1팀 구민석</td>
                <td>
                  <div>
                    <img src={mail_important_active} alt="mail_important_active" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    2024년 5월 급여명세서 보내드립니다.
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle"/>
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>

              <tr className="board_content">
                <td>
                  <label className="custom-checkbox">
                    <input type="checkbox" id="check1" />
                    <span></span>
                  </label>
                </td>
                <td>개발 1팀 구민석</td>
                <td>
                  <div>
                    <img src={mail_important_active} alt="mail_important_active" />
                    <img src={mail_attachment} alt="mail_attachment" />
                  </div>
                  <span>[받은 메일함]</span>
                  <div>
                    2024년 5월 급여명세서 보내드립니다.
                  </div>
                  <div>
                    <img src={mail_triangle} alt="mail_triangle" onClick={toggleMailContent}/>
                  </div>
                </td>
                <td>2024.12.30</td>
              </tr>
              {mailcontentVisible && (
                <tr className="mail_detail_overlay">
                  <td colSpan={4}>
                    <div className="mail_detail_header">
                      <span>2024년 5월 급여명세서 보내드립니다.</span>
                      <img src={mail_delete} alt="mail_delete" />
                    </div>
                    <div className="mail_detail_content">
                      <div className="mail_detail_content_top">
                        <div>
                          <div>
                            <div>개발1팀 장현지</div>
                            <span>2024.04.04 10:37</span>
                          </div>
                          <div>
                            <span>업무설정.pdf</span>
                            <img src={mail_download} alt="mail_download" />
                          </div>
                        </div>
                        <div>
                          <div>받는 사람 :</div>
                          <div>개발부 진유빈</div>
                        </div>
                      </div>

                      <div className="mail_detail_content_middle">
                        <div>
                          안녕하세요. 각 팀의 조직도에 변경 사항이 있어 안내문을 배포합니다. <br/>
                          개발부 - 개발1부, 개발2부가 아닌 개발 1팀 및 개발 2팀으로 부서 이름이 변경되었음을 알립니다. <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                          스크롤 <br/>
                        </div>
                      </div>

                      <div className="mail_detail_content_bottom">
                        <button className="white_button">전달</button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default Mail;