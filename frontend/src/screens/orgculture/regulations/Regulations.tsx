import { useState, useEffect } from "react";
import "./Regulations.scss";
import {
  SearchIcon
} from "../../../assets/images/index";
import { ReactComponent as RightIcon } from "../../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/Common/FirstLeftIcon.svg";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { CheckRegul } from "../../../services/announcement/Regulation";

const Regulations = () => {
  let navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const postPerPage: number = 10;

  // useEffect(() => {
  //   const initialAnnouncements = [
  //     { id: 1, title: "공지사항", views: 100, date: "2024-05-01" },
  //     { id: 2, title: "ㅁㄹㄴㅇ", views: 200, date: "2024-05-02" },
  //     { id: 3, title: "ㅂㅈㄷㄱ", views: 300, date: "2024-05-03" },
  //     { id: 4, title: "ㅌㅊㅋㅍ", views: 100, date: "2024-05-01" },
  //     { id: 5, title: "ㄴㅇㅎㄴ", views: 200, date: "2024-05-02" },
  //     { id: 6, title: "sgdfg", views: 300, date: "2024-05-03" },
  //     { id: 7, title: "df", views: 100, date: "2024-05-01" },
  //     { id: 8, title: "ewretwrwet", views: 200, date: "2024-05-02" },
  //     { id: 9, title: "sdfh", views: 100, date: "2024-05-01" },
  //     { id: 10, title: "xcvb", views: 200, date: "2024-05-02" },
  //     { id: 11, title: "tyoyyty", views: 100, date: "2024-05-01" },
  //     { id: 12, title: "op", views: 200, date: "2024-05-02" },
  //   ];
  //   setAnnouncements(initialAnnouncements);
  // }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await CheckRegul();
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/regulations"} className="sub_header">사내규정</Link>
      </div>

      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">사내규정</div>
            <div className="input-wrapper">
              <input
                type="search"
                className="input_form"
                placeholder="검색할 내용을 입력하세요."
                value={searchTerm}
                onChange={handleSearch}
              />
              <img src={SearchIcon} alt="SearchIcon" className="search-icon" />
            </div>
          </div>

          <div>
            <table className="regulation_board_list">
              <colgroup>
                <col width="6%" />
                <col width="84%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>순번</th>
                  <th>제목</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {filteredAnnouncements
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((announcement) => (
                    <tr key={announcement.id} className="board_content">
                      <td style={{ color: "#D56D6D" }}>공지</td>
                      <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                        <Link to={`/detailRegulation/${announcement.id}`}>{announcement.title}</Link>
                      </td>
                      <td>{announcement.date}</td>
                    </tr>
                  ))}
              </tbody>
            </table>


            <div className="main_bottom">
              <Pagination
                activePage={page}
                itemsCountPerPage={postPerPage}
                totalItemsCount={filteredAnnouncements.length}
                pageRangeDisplayed={Math.ceil(filteredAnnouncements.length / postPerPage)}
                prevPageText={<LeftIcon />}
                nextPageText={<RightIcon />}
                firstPageText={<FirstLeftIcon />}
                lastPageText={<LastRightIcon />}
                onChange={handlePageChange}
              />
              <button className="primary_button" onClick={() => { navigate("/writeRegulation") }}>게시물 작성</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regulations;