import React, { useState, useEffect } from "react";
import { SearchIcon, PinnedIcon } from "../../../assets/images/index";
import { ReactComponent as RightIcon } from "../../../assets/images/Common/RightIcon.svg";
import { ReactComponent as LeftIcon } from "../../../assets/images/Common/LeftIcon.svg";
import { ReactComponent as LastRightIcon } from "../../../assets/images/Common/LastRightIcon.svg";
import { ReactComponent as FirstLeftIcon } from "../../../assets/images/Common/FirstLeftIcon.svg";
import { useNavigate, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import { CheckAnnounce, incrementViewCount, PinnedAnnouncement } from "../../../services/announcement/Announce";
import { useRecoilValue } from 'recoil';
import { userState } from '../../../recoil/atoms';

import { useQueryClient, useQuery } from "react-query";

const Announcement = () => {
  let navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  // const [detailAnno, setDetailAnno] = useState<any[]>([]);
  const userName = useRecoilValue(userState).name;
  const [postPerPage, setPostPerPage] = useState<number>(10);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const [clickIdx, setClickIdx] = useState<number | null>(null);
  console.log(userName);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1600) {
        setPostPerPage(10); // Desktop
      } else if (window.innerWidth >= 992) {
        setPostPerPage(8); // Laptop
      } else {
        setPostPerPage(8);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await CheckAnnounce();
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  useQuery("announcements", fetchAnnouncements, {
    onSuccess: (data) => {
      setAnnouncements(data);
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRightClick = (index: number, event: React.MouseEvent<HTMLTableCellElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdownOpen(true);
    setDropdownPosition({ x: event.pageX+50, y: event.pageY });
    console.log('선택된 게시글 idx', clickIdx)
    setClickIdx(index);
  };

  const handlePinClick = async(event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await PinnedAnnouncement(clickIdx);
      
      const pinnedAnnouncements = announcements.filter(announcement => announcement.pinned);

      if (pinnedAnnouncements.length >= 5) {
        const oldestPinnedAnnouncement = pinnedAnnouncements.reduce((oldest, current) =>
          new Date(oldest.pinnedAt) < new Date(current.pinnedAt) ? oldest : current
        );

        PinnedAnnouncement(oldestPinnedAnnouncement.id)
        queryClient.invalidateQueries("announcements");
      }

    setDropdownOpen(false);
    queryClient.invalidateQueries("announcements");
    } catch (error) {
      console.error('게시글 고정 에러', error);
    }
  }

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.pinned && b.pinned) {
      return new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime();
    } else if (a.pinned) {
      return -1;
    } else if (b.pinned) {
      return 1;
    } else {
      return 0;
    }
  });

  const filteredAnnouncements = sortedAnnouncements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownOpen && !event.target.closest('.dropdown-menu')) {
        setDropdownOpen(false);
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  console.log(announcements)

  return (
    <div className="content">
      <div className="content_header">
        <div className="main_header">조직문화</div>
        <div className="main_header">＞</div>
        <Link to={"/"} className="sub_header">
          공지사항{userName}
        </Link>
      </div>
      <div className="content_container">
        <div className="container">
          <div className="main_header">
            <div className="header_name">공지사항</div>
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
            <table className="announce_board_list">
              <colgroup>
                <col width="6%" />
                <col width="74%" />
                <col width="10%" />
                <col width="10%" />
              </colgroup>
              <thead>
                <tr className="board_header">
                  <th>구분</th>
                  <th>제목</th>
                  <th>조회수</th>
                  <th>등록일</th>
                </tr>
              </thead>
              <tbody className="board_container">
                {filteredAnnouncements
                  .slice((page - 1) * postPerPage, page * postPerPage)
                  .map((announcement) => (
                    <tr key={announcement.id} className={`board_content ${announcement.isPinned ? "pinned" : ""}`}>
                      <td style={{ color: "#D56D6D" }}>공지</td>
                      <td style={{ textAlign: "left", paddingLeft: "20px" }} onContextMenu={(e) => handleRightClick(announcement.id, e)}>
                        <Link to={`/detailAnnounce/${announcement.id}`} style={{ display: 'flex', gap: '10px', alignItems: 'center'}} onClick={() => {incrementViewCount(announcement.id)}}>
                          {announcement.pinned ? (
                            <img src={PinnedIcon} alt="PinnedIcon" className="pinned_icon" />
                          ) : null}
                          <div className="dropdown">
                            {announcement.title}
                            {dropdownOpen && clickIdx === announcement.id && (
                              <div className="dropdown-menu" style={{ position: 'absolute', top: dropdownPosition.y - 50, left: dropdownPosition.x - 250 }}>
                                <button className="dropdown_pin" onClick={handlePinClick}>
                                  {announcement.pinned ? "고정 해제" : "고정"}
                                </button>
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td>{announcement.views}</td>
                      <td>{new Date(announcement.date).toISOString().substring(0, 10)}</td>
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
              <button
                className="primary_button"
                onClick={() => {
                  navigate("/writeAnnounce");
                }}
              >
                게시물 작성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
